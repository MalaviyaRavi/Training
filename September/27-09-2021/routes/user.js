const express = require("express");
const {
  getLogin,
  getSignup,
  postSignup,
  getProfile,
  postLogin,
  getLogout,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
  getForgotPassword,
  postForgotPassword,
  getForgotPasswordForm,
  postForgotPasswordForm,
} = require("../controllers/user-controllers");
const { isAuth } = require("../middlewares/auth");
const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/signup", getSignup);
router.post("/signup", postSignup);

router.get("/profile", isAuth, getProfile);

//Edit Profile
router.get("/edit-profile/:id", isAuth, getEditProfile);
router.post("/edit-profile/:id", isAuth, postEditProfile);

router.get("/change-password", isAuth, getChangePassword);
router.post("/change-password", isAuth, postChangePassword);

router.get("/forgot-password", getForgotPassword);
router.post("/forgot-password", postForgotPassword);

router.get("/forgot-password/:userid/:token", getForgotPasswordForm);
router.post("/forgot-password/:userid/:token", postForgotPasswordForm);

router.get("/logout", isAuth, getLogout);
module.exports = router;
