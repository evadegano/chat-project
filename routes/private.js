const router = require("express").Router();



// get join chat route
router.get("/join-chat", (req, res, next) => {
  // make sure the user is connected
  if (!req.user) {
    res.redirect("/auth/login");
    return;
  }

  res.render("private/join-chat", {
    user: req.user
  });
})

// get chat route

module.exports = router;