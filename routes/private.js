const router = require("express").Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");



// get join chat route
router.get("/join-chat", ensureAuthenticated, (req, res, next) => {
  res.render("private/join-chat", {
    user: req.user
  });
})

// get chat route

module.exports = router;