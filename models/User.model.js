const { Schema, model } = require("mongoose");

// init user schema
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Please enter a username"],
    unique: [true, "This username already exists"],
    match: [/[A-z]{3,21}/ , "Usernames must have three to twenty letters only"],
  },
  password: {
    type: String,
    trim: true,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Password must have at least 8 characters and include at least one lowercase and one uppercase letter, one number and one special character."]
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Please enter your email address"],
    unique: [true, "This email address is already linked to an account"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid email address."]
  },
  GoogleID: String,
},
{
  timestamps: true,
})

const User = model("User", userSchema);

module.exports = User;