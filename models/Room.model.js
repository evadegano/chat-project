const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  name: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User" 
  },
  participants: {
    type: [Schema.Types.ObjectId],
    ref: "User"
  },
  messages: {
    type: [Schema.Types.ObjectId],
    ref: "Message"
  }
},
{
  timestamps: true
})

const Room = model("Room", roomSchema);

module.exports = Room;