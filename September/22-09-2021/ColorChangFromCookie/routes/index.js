var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Change Theme Color" });
});

router.get("/profile", function (req, res, next) {
  console.log(req.cookies);
  let color = req.cookies.color;
  let username = req.cookies.username;
  if (username && color) {
    return res.render("profile", { color: color, username: username });
  }
  res.render("profile", {
    color: "white",
    username: "No Username(Cookie Exprired)",
  });
});

router.post("/", function (req, res, next) {
  console.log(req.body);
  let { username, color } = req.body;
  res.cookie("username", username, { maxAge: 1000 * 60 * 0.5 });
  res.cookie("color", color, { maxAge: 1000 * 60 * 1 });
  res.redirect("/profile");
});

module.exports = router;
