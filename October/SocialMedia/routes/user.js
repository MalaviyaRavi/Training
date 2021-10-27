const router = require("express").Router();
const passport = require("passport");
const {
  getSignup,
  getVarifyAccount,
  getLogin,
  getLogout,
} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isVarified } = require("../middlewares/varify-account");

router.get("/login", getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/signup", getSignup);
router.post(
  "/signup",

  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/logout", isAuthenticated, getLogout);

router.route("/varify-account").get(isAuthenticated, getVarifyAccount);

module.exports = router;
