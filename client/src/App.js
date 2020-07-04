// import React, { useState, useEffect, useRef } from 'react';
import React from 'react';
// import Sidebar from './components/Sidebar';
// import io from 'socket.io-client';
// import UseForm from './utils/useForm';
// import Navbar from './components/Navbar';
// import Username from './components/Username';
import Home from './components/Home';

// const socket = io.connect('http://localhost:3001')

const App = () => {
  
  // const [usernameState, setUsernameState] = useState(true)
  // // const [rooms, setRooms] = useState(['General', 'Work', 'Random']);
  // const [chatState, setChatState] = useState(false);
  // // const [navState, setNavState] = useState(false);
  // const [messages, setMessages] = useState([]);

  // const { values, setValues, handleChange } = UseForm(
  //   {
  //     username: "",
  //     message: "",
  //     newRoom: ""
  //   }
  // );

  // const usernameSubmit = e => {
  //   e.preventDefault();
  //   socket.emit('addUser', values.username);
  //   setUsernameState(false);
  //   setChatState(true);
  // }

  // const messageSubmit = e => {
  //   e.preventDefault();
  //   socket.emit('sendChat',
  //     {
  //       username: values.username,
  //       message: values.message
  //     }
  //   );
  //   console.log('sent!')
  //   setValues({ message: "" })
  // }

  // const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   if (messages[0])
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  // }

  // const createRoom = e => {
  //   e.preventDefault()
  //   socket.emit('createRoom', values.newRoom);
  //   setValues({ newRoom: ""})
  // }

  // useEffect(() => {
  //   socket.on('updateChat', data => {
  //     console.log(data);
  //     setMessages(messages => messages.concat(data))
  //   });

  //   socket.on('changeRoom', setMessages([]));
  // }, []);

  // useEffect(scrollToBottom, [messages])

  return (
    <Home />
  );
}

export default App;

// TODO: Work in progress for dynamic room creation
