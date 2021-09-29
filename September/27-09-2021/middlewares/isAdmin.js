const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.isAdmin = function (req, res, next) {
  if (req.session.userid) {
    User.findOne({ _id: req.session.userid })
      .then((user) => {
        if (user.isAdmin == true) {
          req.session.isAdmin = true;
          return next();
        } else {
          req.session.destroy(() => {
            res.redirect("/login");
          });
        }
      })
      .catch((err) => next(err));
  } else {
    res.redirect("/login");
  }
};
