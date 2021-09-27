function isAuth(req, res, next) {
  if (req.session.userid) {
    return next();
  }
  res.redirect("/login");
}

module.exports = isAuth;
