import React, { useState, useEffect } from 'react';
// import Room from './components/Room'
import io from 'socket.io-client';
import UseForm from './utils/useForm';

function App() {

  const socket = io.connect('http://localhost:3001')

  const [usernameState, setUsernameState] = useState(true)
  const [room, setRoom] = useState('General');
  const [chatState, setChatState] = useState(false);
  const [messages, setMessages] = useState([]);

  const { values, setValues, handleChange } = UseForm(
    {
      username: "",
      message: ""
    }
  )

  const usernameSubmit = e => {
    e.preventDefault();
    socket.emit('addUser', values.username);
    setUsernameState(false);
    setChatState(true);
  }

  const messageSubmit = e => {
    e.preventDefault();
    socket.emit('sendChat',
    {
      username: values.username,
      message: values.message,
      room: room,

    }
    );
    console.log('sent!')
    setValues({ message: "" })
  }

  // socket.on('updateChat', (username, data) => {
  //   setMessages(messages => [...messages, { username, data }])
  // })

  useEffect(() => {
    socket.on('updateChat', (data) => {
      // console.log(username)
      console.log(data);
      setMessages(messages => messages.concat((data)))
    })
  }, [socket])

  return (
    <div>
      <h1>Welcome to Chatticus!</h1>
      {usernameState === true ?
        <form onSubmit={usernameSubmit}>
          <label className=""
            htmlFor="username"
          >
            Please create a username for this session
          </label>
          <input className="border border-black"
            name="username"
            type="text"
            required
            onChange={handleChange}
            value={values.username}
          />
          <button className="border border-black"
            type="submit"
          >Submit</button>
        </form>
      :
        null
      }
      {chatState === false ?
        null
      :
        <React.Fragment>
          <div className="h-64 w-1/3 border border-black">
            {
              messages.map(({username, message}, i) => (
                <div key={i}>
                  <p><span>{username}: </span><span>{message}</span></p>
                </div>
              ))
            }
          </div>
          <form onSubmit={messageSubmit}>
            <input className="border border-black"
              name="message"
              type="text"
              required
              onChange={handleChange}
              value={values.message}
            />
            <button type="submit">Send</button>
          </form>
        </React.Fragment>
      }
    </div>
  );
}

export default App;
