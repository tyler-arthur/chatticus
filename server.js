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

// Set up connection socket
io.on('connection', socket => {
  const { id } = socket.client;
  console.log(`User connected: ${id}`);
  // Chat socket
  socket.on('chat message', msg => {
    // console.log(`${id}: ${msg}`);
    io.emit('chat message', {id, msg});
  });
});


server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
