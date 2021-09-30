var express = require("express");
const { render } = require("../app");
var router = express.Router();
const Admin = require("../models/Admin");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/dashboard", function (req, res, next) {
  if (req.session.adminid) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});

router.post("/", (req, res, next) => {
  let { username, password } = req.body;
  Admin.findOne({ username: username })
    .then((admin) => {
      if (!admin) {
        return res.render("index", {
          isError: true,
          error: "username or password invalid",
        });
      }
      if (password != admin.password) {
        return res.render("index", {
          isError: true,
          error: "username or password invalid",
        });
      }
      //console.log(admin._id);
      //console.log(admin.id);
      req.session.adminid = admin.id;
      res.redirect("/dashboard");
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
