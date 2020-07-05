import React, { useState, useEffect } from 'react';
// import handleChange from '../utils/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import useOnclickOutside from "react-cool-onclickoutside";

const Navbar = (props) => {

  // setting up props from Home.js
  const socket = props.socket;
  const chatState = props.chatState;

  // state for room menus, to open and close
  const [navState, setNavState] = useState(false);
  const [rooms, setRooms] = useState(['General', 'Work', 'Random']);
  const [newRoom, setNewRoom] = useState("");
  const [Room, setRoom] = useState("");

  // Sets user to selected room room
  const joinRoom = (obj) => {
    socket.emit('switchRoom', obj);
    setNavState(false);
  }

  const createRoom = e => {
    e.preventDefault();
    socket.emit('createRoom', newRoom);
    setNewRoom("");
  }

  // Handles the user disconnecting
  const disconnect = () => {
    socket.emit('disconnect');
    window.location.reload(false);
  }

  // Close nav menu when user clicks outside of it
  const ref = useOnclickOutside(() => {
    setNavState(false);
  });

  // Handles user swithcing rooms and recieves server messages as well as broadcasts room change to relavant users
  useEffect(() => {
    socket.on('updateRoom', data => {
      setRooms(data.rooms);
      if(!data.room) return;
      else setRoom(data.room);
    });
  }, [socket])

  return (
    <nav className="px-4 flex items-center flex-grow-0 flex-shrink-0 justify-between h-16 w-full bg-custom-blue text-custom-gold text-3xl md:text-4xl shadow-lg">
    {navState === false ?
      chatState === true ?
        <button className="text-xl md:text-2xl"
          onClick={() => setNavState(!navState)}
        >
          <FontAwesomeIcon icon={faBars} /> {Room}
        </button>
        :
        <button className="text-xl md:text-2xl"></button>
      :
      <React.Fragment>
        <button className="text-xl md:text-2xl"
          onClick={() => setNavState(!navState)}
        >
        <FontAwesomeIcon icon={faBars} rotation={90} /> {Room}
        </button>
        <div className="flex flex-col items-center w-40 p-2 top-0 left-0 mt-16 h-auto absolute pt-1 z-10 border-4 border-custom-biege bg-custom-biege text-xl rounded-br-lg box-border"
          ref={ref}
        >
          {
            rooms.map((room, i) => (
              <button className="py-2 w-full hover:bg-custom-aqua hover:shadow"
                key={i}
                onClick={() => joinRoom(room)}
              >
                {room}
              </button>
            ))
          }
          <div className="">
            <form className="flex flex-col items-center mt-2 space-y-2"
              onSubmit={createRoom}
            >
              <input className="w-full px-2 text-lg text-black rounded-lg"
                name="createRoom"
                type="text"
                placeholder="Create a Room"
                maxLength={15}
                required
                onChange={e => setNewRoom(e.target.value)}
                value={newRoom}
              />
              <button className="py-2 w-full hover:bg-custom-aqua hover:shadow"
                type="submit"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    }
      <p className="text-center">Chatticus</p>
      <button className="text-xl md:text-2xl"
        onClick={disconnect}
      >
        Exit <FontAwesomeIcon icon={faDoorOpen} />
      </button>
    </nav>
  );
};

export default Navbar;


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
// TODO: Work in progress for dynamic room creation