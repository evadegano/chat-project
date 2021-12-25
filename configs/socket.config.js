// init client socket
const io = socketio(server);

const botName = "Signal bot";

// run when client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({username, room}) => {
    const user = {
      username,
      room
    }

    socket.join(user.room);

    // emit message to the client connecting
    socket.emit("message", formatMessage(botName, "Welcome to Chatcord"));

    // broadcast message to the room
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, `${user.username} has joined the chat`));

    // send users and room info
    
  });

  // listen for chat message submition
  socket.on("chatMessage", msg => {
    io.emit("message", msg);
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    // get username that left chat and modify message

    // emit message to everyone
    io.emit("message", formatMessage("User", "A user has left the chat"));

    // send users and room info
  });
})