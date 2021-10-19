const User = require("../../models/User");
const router = require("../../routes/admin");
const bcrypt = require("bcryptjs");
const Token = require("../../models/Token");
const crypto = require("crypto");
const sendMail = require("../../services/sendMail");

exports.getDashboard = function (req, res, next) {
  res.render("admin/dashboard", { title: "Dashboard" });
};

exports.getLogin = function (req, res, next) {
  if (!req.session.userid) {
    return res.render("admin/login", {
      error: req.flash("error"),
      title: "Admin Login",
    });
  }
  res.redirect("/admin/dashboard");
};

exports.postLogin = async function (req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ useremail: email });
  if (!user) {
    req.flash("error", "email or password invalid!!");
    return res.redirect("/admin/login");
  }

  bcrypt
    .compare(password, user.userpassword)
    .then((isValid) => {
      if (!isValid) {
        req.flash("error", "email or password invalid!!");
        return res.redirect("/admin/login");
      }
      if (user.userrole != "admin") {
        req.flash("error", "you are not admin");
        return res.redirect("/admin/login");
      }

      req.session.userid = user.id;
      res.redirect("/admin/dashboard");
    })
    .catch((err) => next(err));
};

exports.getForgotPassword = async function (req, res, next) {
  res.render("admin/forgotpassword", { title: "Forgot Password" });
};

exports.postForgotPassword = async function (req, res, next) {
  let { email } = req.body;
  if (!email) {
    return res.render("admin/forgotpassword", {
      title: "Forgot Password",

      error: "Please Enter Email",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.render("admin/forgotpassword", {
        title: "Forgot Password",

        error:
          "user with given email doesn't exist please enter registred address",
      });
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/admin/forgot-password/${user._id}/${token.token}`;
    console.log(user.useremail);
    await sendMail(user.useremail, "Password reset", link);
    res.redirect("/admin/login");
  } catch (error) {
    next(error);
  }
};

exports.getForgotPasswordForm = async function (req, res, next) {
  res.render("admin/forgotpasswordform", { title: "Forgot Password" });
};

exports.postForgotPasswordForm = async function (req, res, next) {
  let { userid } = req.params;

  let { new_password, repeat_new_password } = req.body;

  if (new_password != repeat_new_password) {
    return res.render("admin/login", {
      isError: true,
      error: "new password & repeat new password must be same",

      title: "Forgot Password",
    });
  }

  const user = await User.findById(req.params.userid);
  console.log("user " + user);
  if (!user) {
    return res.render("admin/login", {
      isError: true,
      error: "invalid link or expired",

      title: "Forgot Password",
    });
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });

  console.log("token" + token);

  if (!token) {
    return res.render("admin/login", {
      isError: true,
      error: "invalid link or expired",

      title: "Forgot Password",
    });
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(new_password, salt, function (err, hash) {
      User.findByIdAndUpdate(userid, { userpassword: hash })
        .then((user) => {
          Token.deleteOne({ userId: user._id })
            .then(() => {
              res.redirect("/admin/login");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          next(err);
        });
    });
  });
};

exports.getResetPassword = async function (req, res, next) {
  res.render("admin/resetpassword", { title: "Change Password" });
};

exports.postResetPassword = async function (req, res, next) {
  let { old_password, new_password, repeat_new_password } = req.body;
  let userid = req.session.userid;

  User.findById(userid)

    .then((user) => {
      bcrypt
        .compare(old_password, user.userpassword)
        .then((result) => {
          console.log(result);
          if (!result) {
            return res.render("admin/changepassword", {
              hasError: true,
              error: "Old Password is wrong please corrret it.!",

              title: "Change Password",
            });
          }

          if (new_password != repeat_new_password) {
            return res.render("admin/changepassword", {
              hasError: true,
              error: "new password & repeat new password must be same",

              title: "Change Password",
            });
          }

          if (old_password == new_password) {
            return res.render("admin/changepassword", {
              hasError: true,
              error: "new password & old should not be same",

              title: "Change Password",
            });
          }

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(new_password, salt, function (err, hash) {
              User.findByIdAndUpdate(userid, { userpassword: hash })
                .then((user) => {
                  res.redirect("/admin/dashboard");
                })
                .catch((err) => {
                  next(err);
                });
            });
          });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getLogout = async function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect("/admin/login");
  });
};
