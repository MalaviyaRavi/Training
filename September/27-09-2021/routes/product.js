const express = require("express");
const router = express.Router();

const {
  getAllCategory,
  getProducts,
} = require("../controllers/product-controllers");

router.get("/category", getAllCategory);

router.get("/products", getProducts);

//router.post("/category", addCategory);

module.exports = router;
