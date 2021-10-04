const express = require("express");
const router = express.Router();
const {
  getCart,
  getAddCart,
  getRemoveCart,
  getClearCart,
} = require("../controllers/cart-controller");
const isAuth = require("../middlewares/isAuth");

router.get("/", isAuth, getCart);

router.get("/removecart/:id", isAuth, getRemoveCart);

router.get("/clear/allitems", isAuth, getClearCart);

router.get("/add-cart/:product_id", isAuth, getAddCart);

module.exports = router;
