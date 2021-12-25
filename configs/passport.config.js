// package to manage auth strategies
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");


module.exports = passport => {
  // init passport strategies
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      (username, password, done) => {
        // search for user in database
        User.findOne({ email: username })
          .then(user => {
            // return error if email adress doesn't exist in the database
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

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("Google account details: ", profile);

        // search for user in database
        User.findOne({ googleID: profile.id })
          .then(user => {
            // log in user if found
            if (user) {
              done(null, user);
              return;
            }

            // add user to database if not found
            User.create({
              email: profile.emails.value,
              googleID: profile.id
            })
              .then(newUser => {
                done(null, newUser);
              })
              .catch(err => done(err));
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
}

