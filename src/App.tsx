import React from 'react';
import BoidsSimulation from './BoidsSimulation';

// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BoidsSimulation />

        <p>
          Testing P5 using the Boids algorithm, and following the implementation on{' '}
          <a className="App-link" href="http://www.red3d.com/cwr/boids/" target="_blank" rel="noopener noreferrer">
            http://www.red3d.com/cwr/boids/
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
