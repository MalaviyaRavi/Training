const router = require("express").Router();
const {
  getAddSubcategory,
  postAddSubcategory,
} = require("../../controllers/admin/subcategory");

router.get("/add", getAddSubcategory);
router.post("/add", postAddSubcategory);

module.exports = router;
