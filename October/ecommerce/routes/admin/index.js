const express = require("express");
const {
  getLogin,
  postLogin,
  getDashboard,
} = require("../../controllers/admin/index");
const { isAuth } = require("../../middlewares/admin/auth");

const router = express.Router();

router.get("/dashboard", isAuth, getDashboard);

router.get("/login", getLogin);

router.post("/login", postLogin);

module.exports = router;
