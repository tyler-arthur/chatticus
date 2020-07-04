import React, { useState, useEffect, useRef } from 'react';
// import Sidebar from './components/Sidebar';
import io from 'socket.io-client';
import UseForm from './utils/useForm';

const socket = io.connect('http://localhost:3001')

function App() {

  
  const [usernameState, setUsernameState] = useState(true)
  const [rooms, setRooms] = useState(['General', 'Work', 'Random']);
  const [chatState, setChatState] = useState(false);
  const [navState, setNavState] = useState(false);
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messages[0])
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
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

  useEffect(scrollToBottom, [messages])

  return (
    <div className="relative bg-custom-green min-h-screen overflow-hidden">
    <nav className="px-4 flex items-center justify-between h-16 w-full bg-custom-blue text-custom-gold text-3xl shadow">
    {navState === false ?
      chatState === true ?
        <button onClick={() => setNavState(true)}>
        =
        </button>
        :
        <button>
        =
        </button>
      :
      <React.Fragment>
        <button onClick={() => setNavState(false)}>
        X
        </button>
        <div className="">
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
      <p>Chatticus</p>
      <button>/</button>
    </nav>
    {usernameState === true ?
      <div >
        <h1 className="text-center text-custom-white text-2xl font-extrabold">Welcome to Chatticus!</h1>
          <form className="flex flex-col items-center space-y-4"
            onSubmit={usernameSubmit}
          >
            <label className="p-2 text-xl text-custom-white font-medium"
              htmlFor="username"
            >
              Please create a username for this session
            </label>
            <input className="p-2 rounded-lg focus:outline-none focus:shadow-outline"
              name="username"
              type="text"
              required
              onChange={handleChange}
              value={values.username}
            />
            <button className="bg-custom-gold p-2 text-custom-blue text-xl font-medium rounded-lg focus:outline-none focus:shadow-outline"
              type="submit"
            >Let's Go!</button>
          </form>
        </div>
      :
        null
      }
      {chatState === false ?
        null
      :
        <React.Fragment>
        <div className="relative pt-8 container h-screen w-screen">
          <div className="h-11/12 p-2 space-y-2 bg-custom-white overflow-scroll">
            {
              messages.map(({username, message}, i) => (
                <div className="text-xl"
                  key={i}
                >
                  <p><span>{username}: </span><span>{message}</span></p>
                </div>
              ))
            }
            <div ref={messagesEndRef} />
          </div>
        </div>
          <form className="flex m-1"
            onSubmit={messageSubmit}
          >
            <input className="p-2 flex-grow text-xl rounded-l-lg focus:outline-none focus:shadow-outline"
              name="message"
              type="text"
              required
              onChange={handleChange}
              value={values.message}
            />
            <button className="p-2 bg-custom-gold text-xl text-custom-blue rounded-r-lg focus:outline-none focus:shadow-outline"
              type="submit"
              >
                Send
              </button>
          </form>
          
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