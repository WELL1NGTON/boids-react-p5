import React from 'react';
import BoidsSimulation from './BoidsSimulation';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Testing P5 using the Boids algorithm implemented in my game Drone Delivery following{' '}
          <a className="App-link" href="http://www.red3d.com/cwr/boids/" target="_blank" rel="noopener noreferrer">
            http://www.red3d.com/cwr/boids/
          </a>
        </p>
        <BoidsSimulation />
      </header>
    </div>
  );
}

export default App;
