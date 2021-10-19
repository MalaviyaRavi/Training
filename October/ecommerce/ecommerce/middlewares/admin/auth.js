exports.isAuth = function (req, res, next) {
  if (req.session.userid) {
    return next();
  }
  res.redirect("/admin/login");
};
