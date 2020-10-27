import Vector2 from './Vector2';

interface IBoid {
  pos: Vector2;
  velocity: Vector2;
  limits: Vector2;
  perceptionRadius: number;
}

class Boid {
  pos: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  limits: Vector2;
  perceptionRadius: number;
  MAX_BIRDS_AWARENESS: number;
  MAX_SPEED: number;
  MAX_FORCE: number;
  MAX_ACCELERATION: number;

  constructor(pos?: Vector2, velocity?: Vector2, perceptionRadius?: number, limits?: Vector2, MAX_BIRDS_AWARENESS?: number, MAX_SPEED?: number) {
    this.limits = limits || new Vector2({ x: 500, y: 500 });
    const smallestLimit = this.limits.x < this.limits.y ? this.limits.x : this.limits?.y;
    this.pos = pos || Vector2.random(0, smallestLimit);
    this.velocity = velocity || Vector2.random(-1, 1);

    this.perceptionRadius = perceptionRadius || 30;

    this.MAX_BIRDS_AWARENESS = MAX_BIRDS_AWARENESS || 7;
    this.MAX_SPEED = MAX_SPEED || 2;
    this.MAX_FORCE = 0.1;
    this.MAX_ACCELERATION = 0.5;
    this.acceleration = Vector2.random(1, this.MAX_ACCELERATION);
  }

  update(flock?: Boid[]) {
    const alignmentMultiplier = 1;
    const cohesionMultiplier = 2;
    const separationMultiplier = 2;
    if (flock) {
      let alignmentValue = this.align(flock);
      let cohesionValue = this.cohesion(flock);
      let separationValue = this.separate(flock);

      alignmentValue = Vector2.mult(alignmentValue, alignmentMultiplier);
      cohesionValue = Vector2.mult(cohesionValue, cohesionMultiplier);
      separationValue = Vector2.mult(separationValue, separationMultiplier);

      this.acceleration = Vector2.add(this.acceleration, alignmentValue);
      this.acceleration = Vector2.add(this.acceleration, cohesionValue);
      this.acceleration = Vector2.add(this.acceleration, separationValue);
    }

    this.pos = Vector2.add(this.pos, this.velocity);
    this.velocity = Vector2.add(this.velocity, this.acceleration);
    this.velocity = this.velocity.clamped(this.MAX_SPEED);
    this.acceleration = Vector2.mult(this.acceleration, 0.5);
    this.edges();
  }

  align(flock: Boid[]) {
    let steering = new Vector2();
    let total = 0;
    for (const boid of flock) {
      if (this !== boid) {
        const isInPerceptionRadius = Vector2.distance(this.pos, boid.pos) <= this.perceptionRadius;
        if (isInPerceptionRadius) {
          steering = Vector2.add(steering, boid.velocity);
          total++;
          if (total >= this.MAX_BIRDS_AWARENESS) break;
        }
      }
    }
    if (total > 0) {
      steering = Vector2.div(steering, total);
      steering = Vector2.mult(steering.normalized(), this.MAX_SPEED);
      steering = Vector2.sub(steering, this.velocity);
      steering = steering.clamped(this.MAX_FORCE);
    }
    return steering;
  }

  separate(flock: Boid[]) {
    let steering = new Vector2();
    let total = 0;
    for (const boid of flock) {
      if (this !== boid) {
        const isInPerceptionRadius = Vector2.distance(this.pos, boid.pos) <= this.perceptionRadius;
        if (isInPerceptionRadius) {
          let diff = Vector2.sub(this.pos, boid.pos);
          const distance = Vector2.distance(this.pos, boid.pos);
          diff = Vector2.div(diff, distance ** 2);
          steering = Vector2.add(steering, diff);
          total++;
          if (total >= this.MAX_BIRDS_AWARENESS) break;
        }
      }
    }
    if (total > 0) {
      steering = Vector2.div(steering, total);
      steering = Vector2.mult(steering.normalized(), this.MAX_SPEED);
      steering = Vector2.sub(steering, this.velocity);
      steering = steering.clamped(this.MAX_FORCE);
    }
    return steering;
  }

  cohesion(flock: Boid[]) {
    let steering = new Vector2();
    let total = 0;
    for (const boid of flock) {
      if (this !== boid) {
        const isInPerceptionRadius = Vector2.distance(this.pos, boid.pos) <= this.perceptionRadius;
        if (isInPerceptionRadius) {
          steering = Vector2.add(steering, boid.pos);
          total++;
          if (total >= this.MAX_BIRDS_AWARENESS) break;
        }
      }
    }
    if (total > 0) {
      steering = Vector2.div(steering, total);
      // steering = Vector2.mult(steering.normalized(), this.MAX_SPEED);
      steering = Vector2.sub(steering, this.pos);
      steering = Vector2.mult(steering.normalized(), this.MAX_SPEED);
      steering = Vector2.sub(steering, this.velocity);
      steering = steering.clamped(this.MAX_FORCE);
    }
    return steering;
  }

  edges() {
    if (this.pos.x > this.limits.x) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = this.limits.x;

    if (this.pos.y > this.limits.y) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = this.limits.y;
  }
}

export default Boid;
