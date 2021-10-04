const isAuth = function (req, res, next) {
  if (req.session.userid) {
    return next();
  }
  res.redirect("/user/login");
};

module.exports = isAuth;
