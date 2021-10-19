var express = require("express");
var router = express.Router();

const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const { check, validationResult } = require("express-validator");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/signup", function (req, res, next) {
  let hasError = false;
  // console.log("error", req.flash("error"));
  let errors = req.flash("error");

  if (errors.length) {
    hasError = true;
  }

  res.render("signup", { errors, hasError });
});

router.post(
  "/signup",
  [
    check("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("username is required")
      .isLength({ min: 5 })
      .withMessage("username should be 5 character long")
      .isAlphanumeric()
      .withMessage("username should have alphanemeric characters!"),

    check("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("please enter valid email address")
      .custom(async (value) => {
        let user = await User.findOne({ email: value });
        console.log("user", user);
        if (user)
          throw new Error("email is already registered, try with new one!!");
        return true;
      }),

    check("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("password should be minimum 8 characters long")
      // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
      // .withMessage(
      //   "password should contain lowercase, uppercase, special character & digits"
      // )
      .custom((value, { req }) => {
        if (value !== req.body.cpassword)
          throw new Error("password & confirm password doen't match");
        return true;
      }),

    check("cpassword")
      .trim()
      .not()
      .isEmpty()
      .withMessage("confirm password is required"),
  ],
  async (req, res, next) => {
    let errorobj = validationResult(req);
    let errors = errorobj.array();

    if (errors.length) {
      let er = {};
      for (let err of errors) {
        if (er[err.param]) {
          er[err.param].push(err.msg);
        } else {
          er[err.param] = [];
          er[err.param].push(err.msg);
        }
      }

      console.log(er);

      return res.render("signup", { errors: er });
    }

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    await User.create({
      username,
      password: hashPass,
      email,
    });
    res.redirect("/login");
  }
);

router.get("/login", function (req, res, next) {
  let error = req.flash("error");

  res.render("login", { error });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/private-page", (req, res) => {
  console.log("sessionid", req.sessionID);
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  console.log(req.user);
  // let username = req.user.username;
  let user = req.user;

  res.render("private", { user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
