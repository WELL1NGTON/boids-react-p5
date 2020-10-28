import React, { useState, useLayoutEffect } from 'react';
import Sketch from 'react-p5';
import p5Types, { Vector } from 'p5'; //Import this for typechecking and intellisense
import Boid from './Boid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

interface ComponentProps {
  //Your component props
}

// function useWindowSize() {
//   const [size, setSize] = useState([0, 0]);
//   useLayoutEffect(() => {
//     function updateSize() {
//       setSize([window.innerWidth, window.innerHeight]);
//     }
//     window.addEventListener('resize', updateSize);
//     updateSize();
//     return () => window.removeEventListener('resize', updateSize);
//   }, []);
//   return size;
// }

const BoidsSketch: React.FC<ComponentProps> = (props: ComponentProps) => {
  // const [width, height] = useWindowSize();
  const [limits, setLimits] = useState<Vector>(new Vector().set(500, 500, 500));

  const [boids, setBoids] = useState<number>(100);
  const [alignmentMultiplier, setAlignmentMultiplier] = useState<number>(1);
  const [cohesionMultiplier, setCohesionMultiplier] = useState<number>(1);
  const [separationMultiplier, setSeparationMultiplier] = useState<number>(1);
  const [maxForce, setMaxForce] = useState<number>(0.1);
  const [maxAcceleration, setMaxAcceleration] = useState<number>(1);
  const [maxSpeed, setMaxSpeed] = useState<number>(2);

  const flock: Boid[] = [];

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const width = p5.windowWidth;
    const height = p5.windowHeight;
    const smallerSize = width < height ? width : height;

    if (p5.width !== smallerSize) {
      const vector = new Vector();
      vector.x = smallerSize;
      vector.y = smallerSize;
      vector.z = smallerSize;
      setLimits(vector);
      p5.resizeCanvas(smallerSize, smallerSize);
    }
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  function updateFlock(flock: Array<Boid>) {
    for (let boid of flock) boid.update(limits, flock, alignmentMultiplier, cohesionMultiplier, separationMultiplier);
  }

  const draw = (p5: p5Types) => {
    updateFlock(flock);
    p5.background(0);
    if (flock.length < boids) flock.push(new Boid());
    else if (flock.length > boids) flock.pop();
    for (const boid of flock) boid.draw(p5);
  };

  const handleAlignmentMultiplierChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setAlignmentMultiplier(value);
  };

  const handleCohesionMultiplierChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setCohesionMultiplier(value);
  };

  const handleSeparationMultiplierChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setSeparationMultiplier(value);
  };

  const handleMaxForceChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setMaxForce(value);
  };

  const handleMaxAccelerationChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setMaxAcceleration(value);
  };

  const handleMaxSpeedChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setMaxSpeed(value);
  };

  const handleResize = (p5: p5Types) => {
    const width = p5.windowWidth;
    const height = p5.windowHeight;
    const smallerSize = width < height ? width : height;

    if (p5.width !== smallerSize) {
      const vector = new Vector();
      vector.x = smallerSize;
      vector.y = smallerSize;
      vector.z = smallerSize;
      setLimits(vector);
      p5.resizeCanvas(smallerSize, smallerSize);
    }
  };

  const handleBoidsChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') setBoids(value);
  };

  return (
    <>
      <Sketch setup={setup} draw={draw} windowResized={handleResize} />
      <>
        <Typography id="boids" gutterBottom>
          Ammount of Boids
        </Typography>
        <Slider value={boids} min={1} max={500} step={1} onChange={handleBoidsChange} valueLabelDisplay="auto" />
      </>
      <>
        <Typography id="alignmentMultiplier" gutterBottom>
          Alignment Multiplier
        </Typography>
        <Slider value={alignmentMultiplier} min={0.1} max={1} step={0.1} onChange={handleAlignmentMultiplierChange} valueLabelDisplay="auto" />
      </>
      <>
        <Typography id="cohesionMultiplier" gutterBottom>
          Cohesion Multiplier
        </Typography>
        <Slider value={cohesionMultiplier} min={0.1} max={1} step={0.1} onChange={handleCohesionMultiplierChange} valueLabelDisplay="auto" />
      </>
      <>
        <Typography id="separationMultiplier" gutterBottom>
          Separation Multiplier
        </Typography>
        <Slider value={separationMultiplier} min={0.1} max={1} step={0.1} onChange={handleSeparationMultiplierChange} valueLabelDisplay="auto" />
      </>
      <>
        <Typography id="maxForce" gutterBottom>
          Max Force
        </Typography>
        <Slider value={maxForce} min={0.1} max={1} step={0.05} onChange={handleMaxForceChange} valueLabelDisplay="auto" />
      </>
      <>
        <Typography id="maxAcceleration" gutterBottom>
          Max Acceleration
        </Typography>
        <Slider value={maxAcceleration} min={0.1} max={10} step={0.1} onChange={handleMaxAccelerationChange} valueLabelDisplay="auto" />
      </>
      <>
        <Typography id="maxSpeed" gutterBottom>
          Max Speed
        </Typography>
        <Slider value={maxSpeed} min={0.1} max={10} step={0.1} onChange={handleMaxSpeedChange} valueLabelDisplay="auto" />
      </>
    </>
  );
};

export default BoidsSketch;
