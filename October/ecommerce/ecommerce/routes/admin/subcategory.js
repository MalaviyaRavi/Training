const router = require("express").Router();
const {
  getAddSubcategory,
  postAddSubcategory,
  getDisplaySubcategory,
  getEditSubcategory,
  postEditSubcategory,
  getDeleteSubcategory,
} = require("../../controllers/admin/subcategory");

router.get("/add", getAddSubcategory);
router.post("/add", postAddSubcategory);

router.get("/display", getDisplaySubcategory);

router.get("/edit/:id", getEditSubcategory);
router.post("/edit/:id", postEditSubcategory);

router.get("/delete/:id", getDeleteSubcategory);

module.exports = router;
