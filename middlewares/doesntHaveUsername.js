module.exports = (req, res, next) => {
  // makes sure user doesn't have a username
  if (req.session.user.username) {
    return res.redirect("/private/join-chat");
  }
  next();
}