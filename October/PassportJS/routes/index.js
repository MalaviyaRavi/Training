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

      .matches("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})")
      .withMessage(
        "password should contain lowercase, uppercase, special character & digits"
      )
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

    check("adhar")
      .trim()
      .not()
      .isEmpty()
      .withMessage("adhar number is required")
      .matches("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$")
      .withMessage("please enter correct adhar number"),

    check("pan")
      .trim()
      .not()
      .isEmpty()
      .withMessage("PAN number is required")
      .matches("[A-Z]{5}[0-9]{4}[A-Z]{1}")
      .withMessage("please enter correct PAN number"),

    check("passport")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Passport number is required")
      .matches("^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$")
      .withMessage("please enter correct Passport number"),

    check("mobile")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Mobile number is required")
      .matches(
        `^(?:(?:\\+|0{0,2})91(\\s*[\\ -]\\s*)?|[0]?)?[789]\\d{9}|(\\d[ -]?){10}\\d$`
      )
      .withMessage("please enter correct Mobile number"),

    check("gst")
      .trim()
      .not()
      .isEmpty()
      .withMessage("GST number is required")
      .matches(`[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`)
      .withMessage("please enter correct GST number"),
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
    successRedirect: "/chat",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/chat", async (req, res) => {
  // console.log("sessionid", req.sessionID);
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  global.sessionid = req.sessionID;

  let userid = req.user._id;
  await User.findByIdAndUpdate(userid, { sessionid: req.sessionID });

  let user = req.user;

  res.render("chat", { user });
});

router.get("/logout", async (req, res) => {
  let userid = req.user._id;
  await User.findByIdAndUpdate(userid, { sessionid: "", socketids: [] });
  req.logout();

  res.redirect("/login");
});

//api
router.get("/getusers", async (req, res, next) => {
  let onlineusers = await User.find({ "socketids.0": { $exists: true } });
  // res.json(onlineusers);
  let offlineusers = await User.find({ "socketids.0": { $exists: false } });
  res.json({ onlineusers, offlineusers });
});

//validation with frontend and backend

const ValidationModel = require("../models/validation-model");

router.get("/validation", function (req, res, next) {
  res.render("validation-form");
});

router.post(
  "/validation",
  [
    check("username")
      .trim()
      .escape()
      .toLowerCase()
      .not()
      .isEmpty()
      .withMessage("username is required")
      .isLength({ min: 5 })
      .withMessage("username should be 5 characters long!"),

    check("email")
      .trim()
      .normalizeEmail()
      .toLowerCase()
      .not()
      .isEmpty()
      .withMessage("emails is required")
      .isEmail()
      .withMessage("please enter email in correct format")
      .custom(async function (email) {
        let data = await ValidationModel.findOne({ email });
        if (data) {
          throw new Error("email already registered try new one");
        }
        return true;
      }),

    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("password should be 8 characters long")
      .matches("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})")
      .withMessage(
        "password contain minimum one lowercase, one uppercase, one special character & one digits"
      ),

    check("cpassword")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("confirm password is required")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("password & confirm password should be same");
        }
        return true;
      }),

    check("gender").not().isEmpty().withMessage("gender is required"),

    check("city").not().isEmpty().withMessage("city is required"),

    check("mobile")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Mobile number is required")
      .matches(
        `^(?:(?:\\+|0{0,2})91(\\s*[\\ -]\\s*)?|[0]?)?[789]\\d{9}|(\\d[ -]?){10}\\d$`
      )
      .withMessage("please enter correct Mobile number"),
  ],
  function (req, res, next) {
    let errorobj = validationResult(req);
    let errors = errorobj.array();

    if (errors.length) {
      return res.json({ error: true, errors });
    }
    res.status(200).json({ error: false, data: { ...req.body } });
  }
);

module.exports = router;
