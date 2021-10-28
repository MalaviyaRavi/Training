const userModel = require("../models/user");

exports.getSignup = function (req, res, next) {
  res.render("pages/signup", { layout: "login", title: "Signup" });
};

exports.getVarifyAccount = function (req, res, next) {
  res.render("pages/varify-account", {
    layout: "login",
    title: "varify account",
    error: req.flash("error")[0],
  });
};

exports.postVarifyAccount = async function (req, res, next) {
  let inputOtp = req.body.otp;
  let { otpGenratedAt, otp } = await userModel
    .findOne({ _id: req.user._id })
    .select("otpGenratedAt otp");
  let currentTime = Date.now();
  let otpGenerationTime = Number(otpGenratedAt);
  if (currentTime - otpGenerationTime <= 180000) {
    if (inputOtp == otp) {
      await userModel.updateOne(
        { _id: req.user._id },
        { $set: { isVarified: true } }
      );
      return res.redirect("/");
    }
    req.flash("error", "Invalid OTP");

    return res.redirect("/varify-account");
  }
  req.flash("error", "OTP validation time up! resent Otp");

  res.redirect("/varify-account");
};

exports.getLogin = function (req, res, next) {
  let error = req.flash("error");
  res.render("pages/login", { layout: "login", title: "login", error });
};

exports.getLogout = function (req, res, next) {
  req.logout();
  res.redirect("/login");
};
