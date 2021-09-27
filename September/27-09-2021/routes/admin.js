const express = require("express");
const {
  getAddProduct,
  postAddProduct,
} = require("../controllers/admin-controllers");
const router = express.Router();

router.get("/add-product", getAddProduct);
router.post("/add-product", postAddProduct);

module.exports = router;
