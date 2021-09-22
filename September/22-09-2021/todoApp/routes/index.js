var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("index", { title: "TodoApp", isLogin: isLogin });
});

module.exports = router;
