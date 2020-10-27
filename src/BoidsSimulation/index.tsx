import React from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5'; //Import this for typechecking and intellisense
import Boid from './Boid';

interface ComponentProps {
  //Your component props
}

const BoidsSketch: React.FC<ComponentProps> = (props: ComponentProps) => {
  let x = 50;
  const y = 50;
  const flock: Boid[] = [];
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  function updateFlock(flock: Array<Boid>) {
    for (let boid of flock) {
      boid.update(flock);
    }
  }

  const draw = (p5: p5Types) => {
    updateFlock(flock);
    if (flock.length < 100) {
      flock.push(new Boid());
    }
    p5.background(0);
    // console.log(flock);
    for (const boid of flock) {
      // console.log(boid);
      // p5.stroke(10, 10);
      // console.log(boid);
      p5.ellipse(boid.pos.x, boid.pos.y, 5, 5);
    }
    // p5.ellipse(x, y, 70, 70);
    // x++;
    // console.log(x);
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default BoidsSketch;
