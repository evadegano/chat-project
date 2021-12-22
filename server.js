// require modules
const server = require("./app");

// set local port
const PORT = process.env.PORT || 3000;

// run app locally
server.listen(PORT, () => console.log("server running on port ", PORT));