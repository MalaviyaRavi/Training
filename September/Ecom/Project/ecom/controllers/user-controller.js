const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendMail = require("../services/sendMail");

const accountSid = "AC83f160dfb8a90fe5658263334cd951b7";
const authToken = "b7e0ba6b49546590b7d9790ce8c0d9ec";

const client = require("twilio")(accountSid, authToken);
//const sendEmail = require("../services/send-mail");

exports.getLogin = function (req, res, next) {
  let isLogin = false;

  if (req.session.userid) {
    isLogin = true;
  }

  if (!req.session.userid) {
    return res.render("pages/user/login", {
      title: "Login",
      isLogin,
    });
  }
  res.redirect("/user/profile");
};

exports.postLogin = function (req, res, next) {
  let isLogin = false;

  if (req.session.userid) {
    isLogin = true;
  }

  console.log(req.body);
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (!email || !password) {
    return res.render("pages/user/login", {
      title: "Login",
      error: "Please Fill Up All Fields",
      isError: true,
      isLogin,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("pages/user/login", {
          title: "Login",
          error: "Email Or Password Invalid",
          isError: true,
          isLogin,
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          console.log(result);
          if (result != true) {
            return res.render("pages/user/login", {
              error: "Email Or Password Invalid",
              isError: true,
              isLogin,
              title: "Login",
            });
          }

          req.session.userid = user.id;
          res.redirect("/user/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

//Signup
exports.getSignup = function (req, res, next) {
  let isLogin = false;

  if (req.session.userid) {
    isLogin = true;
  }
  res.render("pages/user/signup", {
    title: "Register",
    isLogin,
  });
};

// exports.postSignup = function (req, res, next) {
//   console.log(req.body);
//   let isLogin = false;
//   if (req.session.userid) {
//     isLogin = true;
//   }

//   let {
//     first_name,
//     last_name,
//     username,
//     email,
//     mnumber,
//     password,
//     confirm_password,
//     gender,
//     dob,
//     address,
//   } = req.body;

//   if (username.length < 5) {
//     return res.render("pages/user/signup", {
//       isError: true,
//       error: "username must have 5 characters long",
//       title: "Register",
//       isLogin,
//     });
//   }

//   if (password.length < 6 || confirm_password.length < 6) {
//     return res.render("pages/user/signup", {
//       isError: true,
//       error: "password must have 6 characters long",
//       title: "Register",
//       isLogin,
//     });
//   }

//   if (password != confirm_password) {
//     return res.render("pages/user/signup", {
//       isError: true,
//       error: "password must be same with repeat password",
//       title: "Register",
//       isLogin,
//     });
//   }

//   User.findOne({ email: email }).then((user) => {
//     if (user) {
//       return res.render("pages/user/signup", {
//         isError: true,
//         error: "email id is already exist please login ",
//         title: "Register",
//         isLogin,
//       });
//     }

//     bcrypt.genSalt(10, function (err, salt) {
//       bcrypt.hash(password, salt, function (err, hash) {
//         client.messages
//           .create({
//             body: `hello ${first_name} thank you for join with ecom online shop `,
//             from: "+18506800029",
//             to: `+91${mnumber}`,
//           })
//           .then((message) => {
//             User.create({
//               first_name,
//               last_name,
//               username,
//               email,
//               password: hash,
//               gender,
//               address,
//               dob,
//               mnumber,
//             })
//               .then((user) => {
//                 console.log("msg");
//                 req.session.userid = user._id;
//                 res.redirect("/user/profile");
//               })
//               .catch((err) => {
//                 next(err);
//               });
//           });
//       });
//     });
//   });
// };

exports.postSignup = function (req, res, next) {
  console.log(req.body);
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }

  let {
    first_name,
    last_name,
    username,
    email,
    mnumber,
    password,
    confirm_password,
    gender,
    dob,
    address,
  } = req.body;

  if (username.length < 5) {
    return res.render("pages/user/signup", {
      isError: true,
      error: "username must have 5 characters long",
      title: "Register",
      isLogin,
    });
  }

  if (password.length < 6 || confirm_password.length < 6) {
    return res.render("pages/user/signup", {
      isError: true,
      error: "password must have 6 characters long",
      title: "Register",
      isLogin,
    });
  }

  if (password != confirm_password) {
    return res.render("pages/user/signup", {
      isError: true,
      error: "password must be same with repeat password",
      title: "Register",
      isLogin,
    });
  }

  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.render("pages/user/signup", {
        isError: true,
        error: "email id is already exist please login ",
        title: "Register",
        isLogin,
      });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        client.messages
          .create({
            body: `hello ${first_name} thank you for join with ecom online shop `,
            from: "+18506800029",
            to: `+91${mnumber}`,
          })
          .then((message) => {
            User.create({
              first_name,
              last_name,
              username,
              email,
              password: hash,
              gender,
              address,
              dob,
              mnumber,
            })
              .then((user) => {
                console.log("msg");
                req.session.userid = user._id;
                res.redirect("/user/profile");
              })
              .catch((err) => {
                next(err);
              });
          });
      });
    });
  });
};

exports.getProfile = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let userid = req.session.userid;
  console.log(userid);
  User.findOne({ _id: userid })
    .lean()
    .then((user) => {
      res.render("pages/user/profile", {
        user: user,
        title: "Profile",
        isLogin: isLogin,
      });
    });
};

exports.getUploadProfile = function (req, res, next) {
  let isLogin = false;

  if (req.session.userid) {
    isLogin = true;
  }
  res.render("pages/user/uploadprofile", { title: "Upload Picture", isLogin });
};

exports.postUploadProfile = function (req, res, next) {
  {
    console.log("Profile");
    let profileObj = req.files.profile;
    console.log(profileObj);

    profileObj.mv(`public/profile/${req.files.profile.name}`, (err) => {
      if (err) {
        next(err);
      } else {
        User.findById(req.session.userid)
          .then((user) => {
            user.profile = profileObj.name;
            user
              .save()
              .then(() => {
                res.redirect("/user/profile");
              })
              .catch((err) => {
                next(err);
              });
          })
          .catch((err) => {
            next(err);
          });
      }
    });
  }
};

exports.getEditProfile = function (req, res, next) {
  let userid = req.params.id;
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  User.findById(userid)
    .lean()
    .then((user) => {
      res.render("pages/user/edit-profile", {
        user: user,
        title: "Edit Profile",
        isLogin: isLogin,
      });
    });
};

exports.postEditProfile = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let {
    first_name,
    last_name,
    username,
    email,
    gender,
    dob,
    address,
    mnumber,
  } = req.body;

  let userid = req.params.id;
  User.findByIdAndUpdate(userid, {
    first_name,
    last_name,
    username,
    email,
    gender,
    dob,
    address,
    mnumber,
  })
    .then((user) => {
      res.redirect("/user/profile");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getLogout = function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect("/user/login");
  });
};

exports.getChangePassword = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("pages/user/change-password", {
    title: "Change Password",
    isLogin: isLogin,
  });
};

exports.postChangePassword = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let { old_password, new_password, repeat_new_password } = req.body;
  let userid = req.session.userid;
  console.log(userid);
  User.findById(userid)

    .then((user) => {
      bcrypt
        .compare(old_password, user.password)
        .then((result) => {
          console.log(result);
          if (!result) {
            return res.render("pages/user/change-password", {
              isError: true,
              error: "Old Password is wrong please corrret it.!",
              isLogin: isLogin,
              title: "Change Password",
            });
          }

          if (new_password != repeat_new_password) {
            return res.render("pages/user/change-password", {
              isError: true,
              error: "new password & repeat new password must be same",
              isLogin: isLogin,
              title: "Change Password",
            });
          }

          if (old_password == new_password) {
            return res.render("pages/user/change-password", {
              isError: true,
              error: "new password & old should not be same",
              isLogin: isLogin,
              title: "Change Password",
            });
          }

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(new_password, salt, function (err, hash) {
              User.findByIdAndUpdate(userid, { password: hash })
                .then((user) => {
                  res.redirect("/user/profile");
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

exports.getForgotPassword = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("pages/user/forgot-password", {
    title: "Forgot Password",
    isLogin: isLogin,
  });
};

exports.postForgotPassword = async function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }

  let { email } = req.body;
  if (!email) {
    return res.render("pages/user/forgot-password", {
      title: "Forgot Password",
      isLogin: isLogin,
      isError: true,
      error: "Please Enter Email",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.render("pages/user/forgot-password", {
        title: "Forgot Password",
        isLogin: isLogin,
        isError: true,
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

    const link = `http://localhost:3000/forgot-password/${user._id}/${token.token}`;
    console.log(user.email);
    await sendMail(user.email, "Password reset", link);
    res.redirect("/user/login");
  } catch (error) {
    next(error);
  }
};

exports.getForgotPasswordForm = function (req, res, next) {
  res.render("pages/user/forgot-password-form", { title: "Forgot Password" });
};

exports.postForgotPasswordForm = async function (req, res, next) {
  let { userid } = req.params;

  let { new_password, repeat_new_password } = req.body;

  if (new_password != repeat_new_password) {
    return res.render("pages/user/login", {
      isError: true,
      error: "new password & repeat new password must be same",

      title: "Forgot Password",
    });
  }

  const user = await User.findById(req.params.userid);
  console.log("user " + user);
  if (!user) {
    return res.render("pages/user/login", {
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
    return res.render("pages/user/login", {
      isError: true,
      error: "invalid link or expired",

      title: "Forgot Password",
    });
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(new_password, salt, function (err, hash) {
      User.findByIdAndUpdate(userid, { password: hash })
        .then((user) => {
          Token.deleteOne({ userId: user._id })
            .then(() => {
              res.redirect("/user/login");
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
