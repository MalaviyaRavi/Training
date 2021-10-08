const router = require("express").Router();
const {
  getAddProduct,
  getDisplayProduct,
} = require("../../controllers/admin/product");

router.get("/add", getAddProduct);
router.get("/display", getDisplayProduct);

module.exports = router;
