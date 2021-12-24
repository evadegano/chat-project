// require modules
require("dotenv").config();
const http = require("http"); // need to access this directly to use Socket.io
const express = require("express");
const socketio =  require("socket.io");
const passport = require('passport');


// init express app
const app = express();

// import database config
require("./configs/db.config");
// import global config
require("./configs/index.config")(app);
// import session config
require("./configs/session.config")(app);

// import passport
require("./configs/passport.config")(passport);
app.use(passport.initialize());
app.use(passport.session());

// import routers
const mainRouter = require("./routes/index");
app.use("/", mainRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const privateRouter = require("./routes/private");
app.use("/private", privateRouter);

// init http server
const server = http.createServer(app);
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


module.exports = server;