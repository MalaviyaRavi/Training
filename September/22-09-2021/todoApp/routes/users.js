var express = require("express");
var bcrypt = require("bcryptjs");
const isAuth = require("../middlewares/auth");
const User = require("../models/User");
const { signupValidate } = require("../utils/validation");
var router = express.Router();

/* signup */
router.get("/signup", function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("signup", { title: "Register", isLogin: isLogin });
});

router.post("/signup", function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let { username, email, password, password2 } = req.body;

  username = username.trim();
  email = email.trim();
  password = password.trim();
  password2 = password2.trim();
  let new_user;
  signupValidate(username, email, password, password2, res);

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.render("signup", {
          error: "Email Is Already Exists",
          isError: true,
          isLogin: isLogin,
        });
      }
      bcrypt.genSalt(7, function (err, salt) {
        bcrypt.hash("ravi", salt, function (err, hash) {
          new_user = new User({ username, email, password: hash });
          new_user.save(function (err, result) {
            if (err) {
              next(err);
            } else {
              console.log(new_user.id);
              req.session.userid = new_user.id;
              res.redirect("/profile");
            }
          });
        });
      });
    })
    .catch((err) => {
      next(new Error("hello"));
    });

  // bcrypt.genSalt(7, function (err, salt) {
  //   bcrypt.hash("ravi", salt, function (err, hash) {
  //     new_user = new User({ username, email, password: hash });
  //     new_user.save(function (err, result) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log(result.id);
  //         req.session.userid = result.id;
  //         res.redirect("/task");
  //       }
  //     });
  //   });
  // });
});

/* Login Routes*/

router.get("/login", function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("login", { title: "Login", isLogin: isLogin });
});

router.post("/login", function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (!email || !password) {
    return res.render("login", {
      error: "Please Fill Up All Fields",
      isError: true,
      isLogin: isLogin,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("login", {
          error: "Email Or Password Invalid",
          isError: true,
          isLogin: isLogin,
        });
      }
      bcrypt
        .compare("ravi", user.password)
        .then((result) => {
          console.log(result);
          if (result != true) {
            return res.render("login", {
              error: "Email Or Password Invalid",
              isError: true,
              isLogin: isLogin,
            });
          }

          req.session.userid = user.id;
          res.redirect("/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

// PRofile Page

router.get("/profile", isAuth, function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let userid = req.session.userid;

  User.findById(userid).then((user) => {
    res.render("profile", {
      username: user.username,
      email: user.email,
      isLogin: isLogin,
    });
  });
});

router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});
module.exports = router;
