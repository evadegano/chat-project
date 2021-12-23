const mongoose = require("mongoose");

// store database uri
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/signal";

// connect to database
mongoose
  .connect(MONGO_URI)
  .then(x => {
    console.log(`Connected to Mongo! Database name: ${x.connections[0].name}`);
  })
  .catch(err => console.log("Error connecting to Mongo: ", err));