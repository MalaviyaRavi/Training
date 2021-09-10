const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const userControllers = require("../controllers/user-controller");

router.get("/login", userControllers.getLogin);

router.post("/login", userControllers.postLogin);

router.get("/signup", userControllers.getSignup);

router.post("/signup", userControllers.postSignup);

router.get("/profile", auth, userControllers.getProfile);

router.get("/logout", userControllers.getLogout);

module.exports = router;
