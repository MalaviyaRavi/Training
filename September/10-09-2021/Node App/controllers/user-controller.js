const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLogin = async (req, res, next) => {
  let isLogin = false;
  if (req.user) {
    isLogin = true;
  }
  res.render("login", {
    isLogin: isLogin,
    page_title: "Login",
    active_page: "login",
  });
};

exports.getLogout = async (req, res, next) => {
  res.cookie("token", "");
  res.redirect("/login");
};

exports.getProfile = async (req, res, next) => {
  let isLogin = false;
  if (req.user) {
    isLogin = true;
  }
  res.render("profile", {
    isLogin: isLogin,
    user: req.user.name,
    page_title: "Profile",
    active_page: "profile",
  });
};

exports.postLogin = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  //console.log(email, password);
  let user;

  try {
    user = await User.findOne({ email: email });
    //console.log(user.password);
    if (!user) {
      return next(new Error("email or password invalid"));
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new Error("email or password invalid"));
    }
    const token = jwt.sign({ user_id: user._id }, "abc123", {
      expiresIn: "2h",
    });

    res.cookie(`token`, token.toString());

    res.redirect("/profile");
  } catch (error) {
    return next(error);
  }
};

exports.getSignup = async (req, res, next) => {
  let isLogin = false;
  if (req.user) {
    isLogin = true;
  }
  res.render("signup", {
    isLogin: isLogin,
    page_title: "Signup",
    active_page: "signup",
  });
};

exports.postSignup = async (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password;
  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      password = await bcrypt.hash(req.body.password, 10);
      user = new User({
        name,
        email,
        password,
      });
      await user.save();
      console.log("User Registered Successfully");
      res.redirect("/login");
    } else {
      return next(new Error("User Is Already Registered!!"));
    }
  } catch (error) {
    return next(error);
  }
};
