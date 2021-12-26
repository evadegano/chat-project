const router = require("express").Router();
const User = require("../models/User.model");
let { transporter, recoveryText, recoveryEmail } = require("../configs/nodemailer.config");

// package used for password hashing
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// get recovery request route
router.get("/request", (req, res, next) => {
  res.render("recovery/request");
})


// post recovery request route
router.post("/request", (req, res, next) => {
  const { email } = req.body;

  // search for email in database
  User.findOne({ email })
    .then((user) => {
      // return an error if email not found
      if (!user) {
        return res.render("recovery/request", {
          errorMessage: "There is no account linked to this email address."
        })
      }

      // else, send recovery email
      return transporter
        .sendMail({
          from: '"Signal" <help@signal.com>',
          to: email,
          subject: "Reset password request",
          text: recoveryText,
          html: recoveryEmail
        })
        .then((info) => { 
          return res.render("recovery/request", { 
            successMessage: `A recovery email has been sent to ${email}.`
          })
        })
    })
    .catch(err => next(err))
})


// get reset-password route
router.get("/reset-password", (req, res, next) => {
  res.render("recovery/reset-password");
})


// post reset-password route
router.post("/reset-password", (req, res, next) => {
  const { newPassword, confirmationPassword } = req.body;

  // make sure no field is empty
  if (!newPassword || !confirmationPassword) {
    return res
      .status(400)
      .render("recovery/reset-password", {
      errorMessage: "Please fill in all fields."
    })
  }

  // make sure both passwords are the same
  if (newPassword !== confirmationPassword) {
    return res
      .status(400)
      .render("recovery/reset-password", {
        errorMessage: "Your password and confirmation password must be the same."
      })
  }

  // make sure password has the right format
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (!pwdRegex.test(newPassword)) {
    return res
      .status(400)
      .render("recovery/reset-password", {
        errorMessage: "Password must have at least 8 characters and include at least one lowercase and one uppercase letter, one number and one special character."
      })
  }

  // hash password
  bcrypt.genSalt(saltRounds)
    .then((salt) => { bcrypt.hashSync(newPassword, salt) })
    .then((hashedPwd) => {
      // update user's password in database
      return User.findByIdAndUpdate(req.session.user._id, { password: hashedPwd }, { new: true })
    })
    .then((user) => {
      res.render("recovery/reset-password", {
        successMessage: "Your password has been updated successfully!"
      });
    })
    .catch(err => next(err))
})


module.exports = router;