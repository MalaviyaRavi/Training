exports.getSignup = function (req, res, next) {
  res.render("pages/signup", { layout: "login", title: "Signup" });
};

exports.getVarifyAccount = function (req, res, next) {
  res.render("pages/varify-account", {
    layout: "login",
    title: "varify account",
  });
};

exports.getLogin = function (req, res, next) {
  let error = req.flash("error");
  res.render("pages/login", { layout: "login", title: "login", error });
};

exports.getLogout = function (req, res, next) {
  req.logout();
  res.redirect("/login");
};
