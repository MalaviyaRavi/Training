const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

module.exports = (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect("/login");
    //return next(new Error("You Are Not Autorized To Access private resourse"));
  }

  const decoded = jwt.verify(req.cookies.token, "abc123");
  let id = decoded.user_id;
  User.findById(id, function (err, user) {
    if (err) {
      return res.redirect("/login");
    } else {
      console.log(user);
      req.user = user;
      next();
    }
  });
};
