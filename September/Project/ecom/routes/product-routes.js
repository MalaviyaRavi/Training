var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/products/product_page", { title: "Shop" });
});

module.exports = router;
