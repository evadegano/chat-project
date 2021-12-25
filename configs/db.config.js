const mongoose = require("mongoose");

// connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => {
    console.log(`Connected to Mongo! Database name: ${x.connections[0].name}`);
  })
  .catch(err => console.log("Error connecting to Mongo: ", err));