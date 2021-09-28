const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.isAdmin = function (req, res, next) {
  if (req.session.userid) {
    User.findOne({ _id: req.session.userid })
      .then((user) => {
        if (user.isAdmin == true) {
          return next();
        }

        return res.render("login", {
          isError: true,
          error: "please login as admin",
          title: "Login",
        });
      })
      .catch((err) => next(err));
  }
};