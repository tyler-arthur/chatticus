import React from 'react';
import Room from './components/Room'

function App() {

  return (
    <div className="flex flex-col items-start">
      <button>Create Room</button>
      <p>Or join a room</p>
      <button>Room 1</button>
      <button>Room 2</button>
      <button>Room 3</button>
    </div>
  );
}

export default App;
