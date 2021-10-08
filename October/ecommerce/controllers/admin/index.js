const User = require("../../models/User");
const router = require("../../routes/admin");

exports.getDashboard = function (req, res, next) {
  res.render("admin/dashboard", { title: "Dashboard" });
};

exports.getLogin = function (req, res, next) {
  res.render("admin/login", {
    error: req.flash("error"),
    title: "Admin Login",
  });
};

exports.postLogin = async function (req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "email or password invalid!!");
    return res.redirect("/admin/login");
  }
  if (password != user.password) {
    req.flash("error", "email or password invalid!!");
    return res.redirect("/admin/login");
  }
  if (user.role != "admin") {
    req.flash("error", "you are not admin");
    return res.redirect("/admin/login");
  }
  req.session.userid = user.id;
  res.redirect("/admin/dashboard");
};
