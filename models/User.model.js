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
  },
  GoogleID: String,
},
{
  timestamps: true,
})

const User = model("User", userSchema);

module.exports = User;