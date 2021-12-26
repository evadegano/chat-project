// require modules
require("dotenv").config();
const http = require("http"); // need to access this directly to use Socket.io
const express = require("express");
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

const recoveryRouter = require("./routes/recovery");
app.use("/recovery", recoveryRouter);

const privateRouter = require("./routes/private");
app.use("/private", privateRouter);

// init http server
const server = http.createServer(app);


module.exports = server;