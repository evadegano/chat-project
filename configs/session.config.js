// package to store user ingo in session
const session = require("express-session");
// package to store session in database
const MongoStore = require("connect-mongo");



module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET || "this is the secret of the app",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      })
    })
  );
}