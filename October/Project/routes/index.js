var express = require("express");
const { getSignup } = require("../controllers/index");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { layout: "login" });
});

router.get("/signup", getSignup);

module.exports = router;
