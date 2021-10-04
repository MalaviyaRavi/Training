var express = require("express");
const { getIndex } = require("../controllers/index-controller");
const {
  getProductDetail,
  getByCategory,
  getBbySearch,
} = require("../controllers/product-controller");
const Product = require("../models/Product");
var router = express.Router();

/* GET home page. */
router.get("/:id", getProductDetail);

router.get("/category/:category", getByCategory);

module.exports = router;
