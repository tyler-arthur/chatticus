import React from 'react';
import io from 'socket.io-client';
import UseForm from './utils/useForm';

const socket = io.connect('http://localhost:3001')

function App() {

  // Function for message submission
  const onMessageSubmit = () => {
    socket.emit('chat message', values.message);
    console.log("Sent!");
    setValues({ message: "" });
  }

  // UseForm handles state for values, inputChange and form submission
  const { values, setValues, handleChange, handleSubmit} = UseForm(
  {
    message: ""
  }, onMessageSubmit)
    
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input className="border border-black"
          name="message"
          type="text"
          onChange={handleChange}
          value={values.message}
        />
        <button type="submit">Send</button>
      </form>
  </div>
  );
}

export default App;
