import React, { useState, useEffect, useRef } from 'react';
// import Sidebar from './components/Sidebar';
import io from 'socket.io-client';
import UseForm from './utils/useForm';
import Navbar from './components/Navbar';
import Username from './components/Username';

const socket = io.connect('http://localhost:3001')

function App() {

  
  const [usernameState, setUsernameState] = useState(true)
  // const [rooms, setRooms] = useState(['General', 'Work', 'Random']);
  const [chatState, setChatState] = useState(false);
  // const [navState, setNavState] = useState(false);
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

  const createRoom = e => {
    e.preventDefault()
    socket.emit('createRoom', values.newRoom);
    setValues({ newRoom: ""})
  }

  useEffect(() => {
    socket.on('updateChat', data => {
      console.log(data);
      setMessages(messages => messages.concat(data))
    });

    socket.on('changeRoom', setMessages([]));
  }, []);

  useEffect(scrollToBottom, [messages])

  return (
    <div className="relative bg-custom-green min-h-screen overflow-hidden">
    <Navbar 
      socket={socket} 
      chatState={chatState}
    />
    {usernameState === true ?
      <div>
        <Username
          handleChange={handleChange}
          username={values.username}
          submit={usernameSubmit}
        />
      </div>
      :
        null
      }
      {chatState === false ?
        null
      :
        <React.Fragment>
          <div className="h-screen-1/2 md:h-screen-3/4 lg mt-2 md:mx-40 flex-shrink-0 md:p-4 md:rounded-lg p-2 space-y-2 bg-custom-white overflow-y-scroll shadow-inner">
            {
              messages.map(({username, message}, i) => (
                <div className="text-xl"
                  key={i}
                >
                  <p><span className="underline">{username}</span><span> : {message}</span></p>
                </div>
              ))
            }
            <div ref={messagesEndRef} />
          </div>
          <form className="flex m-2 md:justify-center md:mx-40 lg:mx-32"
            onSubmit={messageSubmit}
          >
            <input className="p-2 flex-grow text-xl rounded-l-lg focus:outline-none focus:shadow-outline"
              name="message"
              type="text"
              placeholder="Start typing..."
              required
              onChange={handleChange}
              value={values.message}
            />
            <button className="p-2 px-6 bg-custom-gold text-xl text-custom-blue rounded-r-lg focus:outline-none focus:shadow-outline"
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