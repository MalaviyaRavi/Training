var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/index", { title: "Home" });
});

router.get("/about", function (req, res, next) {
  res.render("pages/about", { title: "About Us" });
});

router.get("/contact", function (req, res, next) {
  res.render("pages/contact", { title: "Contact Us" });
});

module.exports = router;
