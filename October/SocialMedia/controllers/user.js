exports.getSignup = function (req, res, next) {
  res.render("pages/signup", { layout: "login", title: "Signup" });
};
