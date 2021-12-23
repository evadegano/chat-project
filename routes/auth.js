const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const saltRounds = 10;



// get sign up route
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
})


// post sign up route
router.post("/signup", (req, res, next) => {
  // get user form responses
  const { username, email, password, confirmationPassword } = req.body;
  
  // make sure no field is empty
  if (!username || ! email || !password || !confirmationPassword) {
    return res
      .status(400)
      .render("auth/signup", {
      errorMessage: "Please fill in all fields."
    })
  }

  // make sure both passwords are the same
  if (password !== confirmationPassword) {
    return res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Your password and confirmation password must be the same."
      })
  }

  // make sure password has the right format
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (!pwdRegex.test(password)) {
    return res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password must have at least 8 characters and include at least one lowercase and one uppercase letter, one number and one special character."
      })
  }

  // make sure email address has the right format
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Please use a valid email address."
      })
  }

  // make sure username has the right format
  const nameRegex = /[A-z]{3,21}/;

  if (!nameRegex.test(username)) {
    return res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Usernames must have three to twenty letters only."
      })
  }

  // search for username in the database
  const findUsername = User.findOne({ username })

  // search for email address in the database
  const findEmail = User.findOne({ email })

  Promise.all([findUsername, findEmail])
    .then((values) => {
      // get responses from promises
      const [ usernameFromDb, emailFromDb ] = values;

      // if username already exists, return error to the user
      if (usernameFromDb) {
        return res
          .status(400)
          .render("auth/signup", {
            errorMessage: "This username already exists."
          })
      }

      // if email exists, return error to the user
      if (emailFromDb) {
        return res
          .status(400)
          .render("auth/signup", {
            errorMessage: "This email address is already linked to an account."
          })
      }

      // hash password
      return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hashSync(password, salt))
        .then((hashedPwd) => {
          // create user and add it to the database
          return User.create({
            username,
            email,
            password: hashedPwd,
          });
        })
        .then((user) => {
          // store user in a session
          req.session.user = user;
          console.log("user ==> ", req.session.user)

          // redirect user to the join page
          return res.redirect("/private/join-chat");
        })
        /*
          Question for Antoine: is this catch err in the right place
          What about the instance of? Or should it be in the catch err of promise all?
          How do we decide on status code numbers?
          Should we only use mongo err or also the ones above?
        */
        .catch(err => {
          if (err instanceof mongoose.Error.ValidationError) {
            return res
              .status(500)
              .render("auth/signup", {
                errorMessage: error.message
              })
          } else if (error.code === 11000) {
            return res
              .status(500)
              .render("auth/signup", {
                errorMessage: "Username and/or email already taken."
              })
          } else {
            return next(err)
          }
        })
    })
    .catch(err => next(err))
})


// get log in route
router.get("/login", (req, res, next) => {
  res.render("auth/login");
})


// post log in route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/private/join-chat",
  failureRedirect: "/auth/login"
  })
)


// post logout route
router.post("/logout", (req, res, next) => {
  // destroy user session
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(400)
        .render("private/join-chat", {
          errorMessage: err.message
        })
    }

    // send user back to homepage
    res.redirect("/");
  })
})


module.exports = router;