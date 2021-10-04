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
  postUploadProfile,
  getUploadProfile,
} = require("../controllers/user-controller");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/signup", getSignup);
router.post("/signup", postSignup);

router.get("/profile", isAuth, getProfile);

router.get("/uploadprofile", isAuth, getUploadProfile);
router.post("/uploadprofile", isAuth, postUploadProfile);

//Edit Profile
router.get("/profile/edit-profile/:id", isAuth, getEditProfile);
router.post("/profile/edit-profile/:id", isAuth, postEditProfile);

router.get("/profile/change-password", isAuth, getChangePassword);
router.post("/profile/change-password", isAuth, postChangePassword);

router.get("/forgot-password", isAuth, getForgotPassword);
router.post("/forgot-password", isAuth, postForgotPassword);

router.get("/forgot-password/:userid/:token", getForgotPasswordForm);
router.post("/forgot-password/:userid/:token", postForgotPasswordForm);

router.get("/logout", getLogout);
module.exports = router;
