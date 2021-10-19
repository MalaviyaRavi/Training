const {
  getAddArea,
  postAddArea,
  getDisplayArea,
  getEditArea,
  postEditArea,
  getDeleteArea,
} = require("../../controllers/admin/area");
const router = require("express").Router();

router.get("/add", getAddArea);
router.post("/add", postAddArea);

router.get("/display", getDisplayArea);

router.get("/edit/:id", getEditArea);
router.post("/edit/:id", postEditArea);

router.get("/delete/:id", getDeleteArea);

module.exports = router;
