import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import UseForm from '../utils/useForm';
import Navbar from './Navbar';
import Username from './Username';

// Creating socket for user session
const socket = io()

const Home = () => {

  // State for user submission form
  const [usernameState, setUsernameState] = useState(true)
  // State to show chat
  const [chatState, setChatState] = useState(false);
  // State to hold messages
  const [messages, setMessages] = useState([]);

  // setting form values, importing generic input handler
  const { values, setValues, handleChange } = UseForm(
    {
      username: "",
      message: ""
    }
  );

  // Submits username and sets states tos how chat
  const usernameSubmit = e => {
    e.preventDefault();
    socket.emit('addUser', values.username);
    setUsernameState(false);
    setChatState(true);
  }

  // Submits messages from user
  const messageSubmit = e => {
    e.preventDefault();
    socket.emit('sendChat',
      {
        username: values.username,
        message: values.message
      }
    );
    setValues({ message: "" })
  }

  // reference for auto bottom scroll
  const messagesEndRef = useRef(null);

  // Scrolls to bottom message when messages exceeds container size
  const scrollToBottom = () => {
    if (messages[0])
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // updates chat from all users
    socket.on('updateChat', data => {
      setMessages(messages => messages.concat(data))
    });
    // sets messages for newly joined room
    socket.on('changeRoom', setMessages([]));
  }, []);

  // scrolls to bottom of chat once messages exceed container size
  useEffect(scrollToBottom, [messages])

  return (
    <div className="relative bg-custom-green min-h-screen overflow-hidden"
    >
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
          <div className="h-screen-1/2 md:h-screen-3/4 mt-2 md:mx-40 flex-shrink-0 md:p-4 md:rounded-lg p-2 space-y-2 bg-custom-white overflow-y-scroll shadow-inner">
            {
              messages.map(({username, message, color}, i) => (
                <div className="text-xl"
                  key={i}
                >
                  <p><span className={`underline text-${color} font-medium`} >{username}</span><span> : {message}</span></p>
                </div>
              ))
            }
            <div ref={messagesEndRef} />
          </div>
          <form className="flex m-2 md:justify-center md:mx-40"
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
};

export default Home;
