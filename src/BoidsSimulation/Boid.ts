import p5Types, { Color, Vector } from 'p5';

interface Colour {
  r: number;
  g: number;
  b: number;
}

export interface IBoid {
  pos: Vector;
  velocity: Vector;
  colour: Colour;
  acceleration: Vector;
  size: number;
  perceptionRadius: number;
  boidsAwareness: number;
}

class Boid2 {
  pos: Vector;
  velocity: Vector;
  acceleration: Vector;
  colour: Colour;
  size: number;
  perceptionRadius: number;
  boidsAwareness: number;

  randomVector(min: number, max: number): Vector {
    const vector: Vector = new Vector();
    vector.x = Math.random() * (max - min) + min;
    vector.y = Math.random() * (max - min) + min;
    vector.z = Math.random() * (max - min) + min;
    return vector;
  }

  constructor(boid?: IBoid) {
    this.colour = (boid && boid.colour) || { r: 255, g: 255, b: 255 };
    this.pos = (boid && boid.pos) || this.randomVector(0, 500);
    this.velocity = (boid && boid.velocity) || this.randomVector(0, 1);
    this.acceleration = (boid && boid.acceleration) || this.randomVector(0, 5);
    this.perceptionRadius = (boid && boid.perceptionRadius) || 30;
    this.size = (boid && boid.size) || 5;
    this.boidsAwareness = (boid && boid.boidsAwareness) || 7;
  }

  update(
    limits: Vector,
    flock?: Boid2[],
    alignmentMultiplier: number = 1,
    cohesionMultiplier: number = 1,
    separationMultiplier: number = 1,
    maxSpeed: number = 2,
    maxAcceleration: number = 0.5,
    maxForce: number = 0.1
  ) {
    if (flock) {
      let alignmentValue: Vector = this.alignment(flock, maxSpeed, maxAcceleration, maxForce);
      let cohesionValue: Vector = this.cohesion(flock, maxSpeed, maxAcceleration, maxForce);
      let separationValue: Vector = this.separation(flock, maxSpeed, maxAcceleration, maxForce);

      alignmentValue = Vector.mult(alignmentValue, alignmentMultiplier);
      cohesionValue = Vector.mult(cohesionValue, cohesionMultiplier);
      separationValue = Vector.mult(separationValue, separationMultiplier);

      this.acceleration = Vector.add(this.acceleration, alignmentValue);
      this.acceleration = Vector.add(this.acceleration, cohesionValue);
      this.acceleration = Vector.add(this.acceleration, separationValue);
    }

    this.pos = Vector.add(this.pos, this.velocity);
    this.velocity = Vector.add(this.velocity, this.acceleration);
    this.velocity = this.velocity.limit(maxSpeed);
    this.acceleration = Vector.mult(this.acceleration, 0.5);
    this.edges(limits);
  }

  separation(flock: Boid2[], maxSpeed: number, maxAcceleration: number, maxForce: number) {
    let steering = new Vector();
    let total = 0;

    for (const boid of flock) {
      if (this !== boid) {
        const isInPerceptionRadius = Vector.dist(this.pos, boid.pos) <= this.perceptionRadius;
        if (isInPerceptionRadius) {
          let diff = Vector.sub(this.pos, boid.pos);
          const distance = Vector.dist(this.pos, boid.pos);
          diff = Vector.div(diff, distance ** 2);
          steering = Vector.add(steering, diff);
          total++;
          if (total >= this.boidsAwareness) break;
        }
      }
    }

    if (total > 0) {
      steering = Vector.div(steering, total);
      steering = Vector.mult(steering.normalize(), maxSpeed);
      steering = Vector.sub(steering, this.velocity);
      steering = steering.limit(maxForce);
    }
    return steering;
  }

  alignment(flock: Boid2[], maxSpeed: number, maxAcceleration: number, maxForce: number) {
    let steering = new Vector();
    let total = 0;
    for (const boid of flock) {
      if (this !== boid) {
        const isInPerceptionRadius = Vector.dist(this.pos, boid.pos) <= this.perceptionRadius;
        if (isInPerceptionRadius) {
          steering = Vector.add(steering, boid.velocity);
          total++;
          if (total >= this.boidsAwareness) break;
        }
      }
    }
    if (total > 0) {
      steering = Vector.div(steering, total);
      steering = Vector.mult(steering.normalize(), maxSpeed);
      steering = Vector.sub(steering, this.velocity);
      steering = steering.limit(maxForce);
    }
    return steering;
  }

  cohesion(flock: Boid2[], maxSpeed: number, maxAcceleration: number, maxForce: number) {
    let steering = new Vector();
    let total = 0;
    for (const boid of flock) {
      if (this !== boid) {
        const isInPerceptionRadius = Vector.dist(this.pos, boid.pos) <= this.perceptionRadius;
        if (isInPerceptionRadius) {
          steering = Vector.add(steering, boid.pos);
          total++;
          if (total >= this.boidsAwareness) break;
        }
      }
    }
    if (total > 0) {
      steering = Vector.div(steering, total);
      steering = Vector.sub(steering, this.pos);
      steering = Vector.mult(steering.normalize(), maxSpeed);
      steering = Vector.sub(steering, this.velocity);
      steering = steering.limit(maxForce);
    }
    return steering;
  }

  // randomColour(): Colour {
  //   const colour: Colour = {
  //     r: Math.floor(Math.random() * 255),
  //     g: Math.floor(Math.random() * 255),
  //     b: Math.floor(Math.random() * 255),
  //   };

  //   return colour;
  // }

  draw(p5: p5Types) {
    // this.colour = this.randomColour();
    p5.stroke(this.colour.r, this.colour.g, this.colour.b);
    p5.strokeWeight(this.size);
    p5.point(this.pos.x, this.pos.y, this.pos.z);
  }

  edges(limits: Vector) {
    if (this.pos.x > limits.x) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = limits.x;

    if (this.pos.y > limits.y) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = limits.y;

    if (this.pos.z > limits.z) this.pos.z = 0;
    else if (this.pos.z < 0) this.pos.z = limits.z;
  }
}

export default Boid2;
