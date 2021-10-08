const router = require("express").Router();
const {
  getAddCategory,
  postAddCategory,
  getDisaplyCategory,
  getEditCategory,
  postEditCategory,
  getDeleteCategory,
} = require("../../controllers/admin/category");

router.get("/add", getAddCategory);

router.post("/add", postAddCategory);

router.get("/display", getDisaplyCategory);

router.get("/edit/:id", getEditCategory);
router.post("/edit/:id", postEditCategory);

router.get("/delete/:id", getDeleteCategory);

module.exports = router;
