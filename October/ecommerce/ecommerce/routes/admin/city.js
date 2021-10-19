const {
  getAddCity,
  postAddCity,
  getDisplayCity,
  getEditCity,
  postEditCity,
  getDeleteCity,
} = require("../../controllers/admin/city");

const router = require("express").Router();

router.get("/display", getDisplayCity);

router.get("/add", getAddCity);
router.post("/add", postAddCity);

router.get("/edit/:id", getEditCity);
router.post("/edit/:id", postEditCity);

router.get("/delete/:id", getDeleteCity);

module.exports = router;
