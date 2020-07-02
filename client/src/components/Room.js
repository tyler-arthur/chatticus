import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UseForm from '../utils/useForm';

const socket = io.connect('http://localhost:3001')

function Room() {

  const [chat, setChat] = useState([]);

  // Function for message submission
  const onMessageSubmit = () => {
    socket.emit('chat message', [values.nickname, values.message]);
    console.log("Sent!");
    setValues({ message: "" });
  }

  // UseForm handles state for values, inputChange and form submission
  const { values, setValues, handleChange, handleSubmit} = UseForm(
  {
    message: "",
    nickname: ""
  }, onMessageSubmit)

  useEffect(() => {
    socket.on('chat message', ({ nickname, msg }) => {
      setChat(chat => chat.concat({ nickname, msg }))
    })
  },[])
    
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label 
          htmlFor="nickname"
          >
          Nickname
          </label>
        <input className="border border-black"
          name="nickname"
          type="text"
          onChange={handleChange}
          value={values.nickname}
        />
        <input className="border border-black"
          name="message"
          type="text"
          onChange={handleChange}
          value={values.message}
        />
        <button type="submit">Send</button>
      </form>
      {
        chat.map(({ nickname, msg }, i) => (
          <div key={i}>
            <span className="text-teal-500">{nickname}</span>
            <span>{msg}</span>
          </div>
        ))
      }
  </div>
  );
}

export default Room;
