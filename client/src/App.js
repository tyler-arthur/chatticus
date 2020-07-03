import React, { useState, useEffect } from 'react';
// import Sidebar from './components/Sidebar';
import io from 'socket.io-client';
import UseForm from './utils/useForm';

const socket = io.connect('http://localhost:3001')

function App() {

  const [usernameState, setUsernameState] = useState(true)
  const [rooms, setRooms] = useState(['General', 'Work', 'Random']);
  const [chatState, setChatState] = useState(false);
  const [messages, setMessages] = useState([]);

  const { values, setValues, handleChange } = UseForm(
    {
      username: "",
      message: "",
      newRoom: ""
    }
  );

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
        message: values.message
      }
    );
    console.log('sent!')
    setValues({ message: "" })
  }

  const joinRoom = (obj) => {
    socket.emit('switchRoom', obj)
  }

  const createRoom = e => {
    e.preventDefault()
    socket.emit('createRoom', values.newRoom);
    setValues({ newRoom: ""})
  }

  useEffect(() => {
    socket.on('updateRoom', data => {
      setRooms(data);
    });

    socket.on('updateChat', data => {
      console.log(data);
      setMessages(messages => messages.concat(data))
    });

    socket.on('changeRoom', setMessages([]));
  }, []);

  return (
    <div>
    <nav className="h-12 w-full bg-custom-blue text">
      <p>Chatticus</p>
    </nav>
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
          <div>
            <h1>Join a Room</h1>  
            {
              rooms.map((room, i) => (
                <button className=""
                  key={i}
                  onClick={() => joinRoom(room)}
                >
                  {room}
                </button>
              ))
            }
            <div>
              
            </div>
          </div>
        </React.Fragment>
      }
    </div>
  );
}

export default App;

// TODO: Work in progress for dynamic room creation
// <form className=""
//   onSubmit={createRoom}
// >
//   <label className=""
//     htmlFor="createRoom"
//   >
//   Create a Room
//   </label>
//   <input className=""
//     name="createRoom"
//     type="text"
//     required
//     onChange={handleChange}
//     value={values.newRoom}
//   />
//   <button className=""
//     type="submit"
//   >
//     Create Room
//   </button>
// </form>