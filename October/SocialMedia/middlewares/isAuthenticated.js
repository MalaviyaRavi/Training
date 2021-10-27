exports.isAuthenticated = function (req, res, next) {
  if (req.user) {
    next();
    return;
  }
  res.redirect("/login");
};
