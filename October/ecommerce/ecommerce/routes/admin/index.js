const express = require("express");
const {
  getLogin,
  postLogin,
  getDashboard,
  getForgotPassword,
  postForgotPassword,
  getForgotPasswordForm,
  postForgotPasswordForm,
  getResetPassword,
  postResetPassword,
  getLogout,
} = require("../../controllers/admin/index");
const { isAuth } = require("../../middlewares/admin/auth");

const router = express.Router();

router.get("/dashboard", isAuth, getDashboard);

router.get("/login", getLogin);

router.post("/login", postLogin);

//forgot password
router.get("/forgotpassword", getForgotPassword);
router.post("/forgotpassword", postForgotPassword);

router.get("/forgot-password/:userid/:token", getForgotPasswordForm);
router.post("/forgot-password/:userid/:token", postForgotPasswordForm);

router.get("/resetpassword", isAuth, getResetPassword);
router.post("/resetpassword", isAuth, postResetPassword);

router.get("/logout", isAuth, getLogout);

module.exports = router;
