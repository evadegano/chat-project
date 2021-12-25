module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  // make the user has a username
  if (!req.session.user.username) {
    return res.redirect("/auth/complete-signup");
  }
  req.user = req.session.user;
  next();
};