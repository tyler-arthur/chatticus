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

let rooms = ['General'];

let usernames = {};

// Set up connection socket
io.on('connection', socket => {
  // Store username of client
  socket.on('addUser', username => {
    console.log(username)
    socket.username = username;
    // Place user in "General Channel"
    socket.room = 'general';
    // Add user to global list
    usernames[username] = username;
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
    socket.emit(
      'updateRooms', 
      rooms, 
      'General'
    );
  });

  // Handle chat messaging
  socket.on('sendChat', data => {
    console.log(data)
    io.to(data.room).emit('updateChat', 
    {
      username: data.username,
      message : data.message
    }
    );
  });

  // Handle switching channels
  socket.on('switchRoom', newRoom => {
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
    socket.broadcast.to(newroom).emit('updatechat',
    {
      username: 'Chattibot',
      message: `${socket.username} has joined this room`
    }
    );
    socket.emit(
      'updateRooms',
      rooms,
      newRoom
    );
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
