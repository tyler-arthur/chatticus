const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io") (server);

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Define API routes here

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// let rooms = [
//   {
//     roomName: "General",
//     users: []
//   }
// ];
let rooms = ['General', 'Work', 'Random']

let usernames = {};

// Set up connection socket
io.on('connection', socket => {
  console.log("Socket connected!")

  socket.on('addUser', username => {
    console.log(username)
    socket.username = username;
    // Add user to global list
    usernames[username] = username;
    // Set room to general
    socket.room = 'General'
    // Send user to "General"
    socket.join('General');
    // Let user know they have connected
    socket.emit('updateChat',
    {
      username: 'Chattibot',
      message: "You have connected to General" 
    }
    );
    // Let channel know user has connected
    socket.broadcast.to('General').emit('updateChat',
    {
      username: 'Chattibot',
      message: `${username} has connected to this room`
    }
    );
    socket.emit('updateRooms', rooms);
    socket.broadcast.emit('updateRooms', rooms)
  });

  // Handle chat messaging
  socket.on('sendChat', data => {
    io.to(socket.room).emit('updateChat', 
      {
        username: socket.username,
        message : data.message
      }
    );
  });

  // Handle creating new channels
  socket.on('createRoom', data => {
    rooms.push(data);
    socket.emit('updateRooms', rooms)
    socket.broadcast.emit('updateRooms', rooms)
  })

  // Handle switching channels
  socket.on('switchRoom', newRoom => {
    if (newRoom === socket.room) return;
    socket.leave(socket.room);
    socket.join(newRoom);

    socket.emit('updateChat',
    {
      username: 'Chattibot',
      message: `You have connected to ${newRoom}` 
    }
    );
    // Let previous channel know user has disconnected
    socket.broadcast.to(socket.room).emit('updateChat',
    {
      username: 'Chattibot',
      message: `${socket.username} has left to this room`
    }
    );
    // Update room
    socket.room = newRoom;
    // Let new channel know user has connected
    socket.broadcast.to(newRoom).emit('updatechat',
    {
      username: 'Chattibot',
      message: `${socket.username} has joined this room`
    }
    );
    socket.emit('updateRooms');
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    // Remove user from global list
    delete usernames[socket.username];
    // Update list of users in chat
    io.sockets.emit('updateUsers', usernames);
    // Broadcast user has disconnected
    socket.broadcast.emit('updateChat',
    {
      username: 'Chattibot',
      message: `${socket.username} has disconnected`
    }
    );
    // Remove user from current room
    socket.leave(socket.room);
  });
});


server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
