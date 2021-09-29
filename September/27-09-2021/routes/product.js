const express = require("express");
const router = express.Router();

const {
  getAllCategory,
  addCategory,
} = require("../controllers/product-controllers");

router.get("/category", getAllCategory);

//router.post("/category", addCategory);

module.exports = router;
