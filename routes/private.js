const router = require("express").Router();
// middlewares
const isLoggedIn = require("../middlewares/isLoggedIn");


// get join chat route
router.get("/join-chat", isLoggedIn, (req, res, next) => {
  console.log("user ==>", req.user)
  res.render("private/join-chat", {
    user: req.user
  });
})

// get chat route

module.exports = router;