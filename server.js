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
} else {
  app.use(express.static("client/public"));
}

// Define API routes here

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Array to hold all active rooms
let rooms = ['General', 'Work', 'Random']
// Holds sockets current room for display
let room;
// Stores all usernames until discconnected
let usernames = {};
// Holds random chat message coloring
let color;
// List of color class names for random chat color
const colors = [
  'red-500',
  'red-600',
  'red-700',
  'orange-500',
  'orange-600',
  'orange-700',
  'yellow-500',
  'yellow-600',
  'yellow-700',
  'green-500',
  'green-600',
  'green-700',
  'teal-500',
  'teal-600',
  'teal-700',
  'blue-500',
  'blue-600',
  'blue-700',
  'indigo-500',
  'indigo-600',
  'indigo-700',
  'purple-500',
  'purple-600',
  'purple-700',
]
// Picks a random index from an array
const colorPicker = (arr, min, max) => {
  const i = Math.floor(Math.random() * (max - min + 1)) + min;
  return arr[i];
}

// Set up connection socket
io.on('connection', socket => {
  console.log("Socket connected!")

  socket.on('addUser', username => {
    socket.username = username;
    // Add user to global list
    usernames[username] = username;
    // Giving user random color
    color = colorPicker(colors, 0, colors.length - 1);
    socket.color = color;
    // Set room to general
    socket.room = 'General';
    room = socket.room;
    // Send user to "General"
    socket.join('General');
    // Let user know they have connected
    socket.emit('updateChat',
    {
      username: 'Chattibot',
      message: "You have connected to General",
      color: 'gray-600'
    }
    );
    // Let channel know user has connected
    socket.broadcast.to('General').emit('updateChat',
    {
      username: 'Chattibot',
      message: `${username} has connected to this room`,
      color: 'gray-600'
    }
    );
    socket.emit('updateRoom', {rooms: rooms, room: room});
    socket.broadcast.emit('updateRoom', {rooms: rooms})
  });

  // Handle chat messaging
  socket.on('sendChat', data => {
    io.to(socket.room).emit('updateChat', 
      {
        username: socket.username,
        message : data.message,
        color: socket.color
      }
    );
  });

  // Handle creating new channels
  socket.on('createRoom', data => {
    rooms.push(data);
    socket.emit('updateRoom', {rooms: rooms})
    socket.broadcast.emit('updateRoom', {rooms: rooms})
  })

  // Handle switching channels
  socket.on('switchRoom', newRoom => {
    if (newRoom === socket.room) return;
    socket.leave(socket.room);
    socket.join(newRoom);

    socket.emit('updateChat',
    {
      username: 'Chattibot',
      message: `You have connected to ${newRoom}`,
      color: 'gray-600'
    }
    );
    // Let previous channel know user has disconnected
    socket.broadcast.to(socket.room).emit('updateChat',
    {
      username: 'Chattibot',
      message: `${socket.username} has left this room`,
      color: 'gray-600'
    }
    );
    // Update room
    socket.room = newRoom;
    room = socket.room;
    // Let new channel know user has connected
    socket.broadcast.to(newRoom).emit('updateChat',
    {
      username: 'Chattibot',
      message: `${socket.username} has joined this room`,
      color: 'gray-600'
    }
    );
    socket.emit('updateRoom', {rooms: rooms, room: room});
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    // Broadcast user has disconnected
    socket.broadcast.emit('updateChat',
    {
      username: 'Chattibot',
      message: `${socket.username} has disconnected`,
      color: 'gray-600'
    }
    );
    // Remove user from global list
    delete usernames[socket.username];
    // Update list of users in chat
    io.sockets.emit('updateUsers', usernames);
    // Remove user from current room
    socket.leave(socket.room);
  });
});

server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});