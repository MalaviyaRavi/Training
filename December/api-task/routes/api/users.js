const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  login,
  getAllUsers,
  checkExistance,
  addUser,
} = require("../../controllers/api/users");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const User = require("../../models/user");

const router = express.Router();

router.post("/login", login);

router.get("/users", isAuthenticated, getAllUsers);

router.get("/users/check", checkExistance);

router.post(
  "/users",
  body("name").notEmpty().withMessage("name is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password should be 6 character long"),
  body("email")
    .isEmail()
    .withMessage("enter valid email address")
    .custom(async function (value) {
      let user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email is already registered");
      }
    }),
  body("mobile")
    .isMobilePhone()
    .withMessage("enter valid mobile number")
    .custom(async function (value) {
      let user = await User.findOne({ mobile: value });
      if (user) {
        throw new Error("mobile is already registered");
      }
    }),
  addUser
);

module.exports = router;
