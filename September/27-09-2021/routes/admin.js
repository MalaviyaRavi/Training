const express = require("express");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  deleteProduct,
  getEditProduct,
  postEditProduct,
} = require("../controllers/admin-controllers");
const { isAdmin } = require("../middlewares/isAdmin");
const router = express.Router();

router.get("/admin/add-product", getAddProduct);
router.post("/admin/add-product", postAddProduct);

router.get("/admin/products", getProducts);

router.get("/admin/delete-product/:id", deleteProduct);

router.get("/admin/edit-product/:id", getEditProduct);
router.post("/admin/edit-product/:id", postEditProduct);

module.exports = router;
