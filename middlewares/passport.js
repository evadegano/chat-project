// package to manage auth strategies
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// init passport strategies
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    (username, password, done) => {
      // search for user in database
      User.findOne({ username })
        .then(user => {
          // return error if email adress doesn't exist in the database
          console.log("yo")

          if (!user) {
            return done(null, false, {
              errorMessage: "Incorrect email address."
            });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {
              errorMessage: "Incorrect password."
            })
          }

          done(null, user);
        })
        .catch(err => done(err));
    }
  )
)

// serialize user to define what data will be kept in the session
passport.serializeUser((user, cb) => cb(null, user._id));
// deserialize user to define what data will be kept in the session
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
})