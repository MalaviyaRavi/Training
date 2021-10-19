const {
  getAddState,
  postAddState,
  getDisplayState,
  getEditState,
  postEditState,
  getDeleteState,
} = require("../../controllers/admin/state");

const router = require("express").Router();

router.get("/display", getDisplayState);

router.get("/add", getAddState);
router.post("/add", postAddState);

router.get("/edit/:id", getEditState);
router.post("/edit/:id", postEditState);

router.get("/delete/:id", getDeleteState);

module.exports = router;
