const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendEmail = require("../services/send-mail");

exports.getLogin = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("login", {
    title: "Login",
    isLogin: isLogin,
  });
};

exports.postLogin = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (!email || !password) {
    return res.render("login", {
      title: "Login",
      error: "Please Fill Up All Fields",
      isError: true,
      isLogin: isLogin,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("login", {
          title: "Login",
          error: "Email Or Password Invalid",
          isError: true,
          isLogin: isLogin,
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          console.log(result);
          if (result != true) {
            return res.render("login", {
              error: "Email Or Password Invalid",
              isError: true,
              isLogin: isLogin,
              title: "Login",
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
};

//Signup
exports.getSignup = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("signup", {
    title: "Register",
    isLogin: isLogin,
  });
};

exports.postSignup = function (req, res, next) {
  console.log(req.body);
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }

  let {
    name,
    username,
    email,
    password,
    password2,
    gender,
    dob,
    address,
    city,
  } = req.body;

  if (
    !name ||
    !username ||
    !email ||
    !password ||
    !password2 ||
    !gender ||
    !dob ||
    !address ||
    !city
  ) {
    return res.render("signup", {
      isError: true,
      error: "Please fill up all the fields",
      title: "Register",
      isLogin: isLogin,
    });
  }

  if (username.length < 5) {
    return res.render("signup", {
      isError: true,
      error: "username must have 5 characters long",
      title: "Register",
      isLogin: isLogin,
    });
  }

  if (password.length < 6 || password2.length < 6) {
    return res.render("signup", {
      isError: true,
      error: "password must have 6 characters long",
      title: "Register",
      isLogin: isLogin,
    });
  }

  if (password != password2) {
    return res.render("signup", {
      isError: true,
      error: "password must be same with repeat password",
      title: "Register",
      isLogin: isLogin,
    });
  }
  const fileobj = req.files.profile;
  if (
    fileobj.mimetype != "image/jpg" &&
    fileobj.mimetype != "image/jpeg" &&
    fileobj.mimetype != "image/png"
  ) {
    return res.render("signup", {
      isError: true,
      error: "profile photo should be image file ",
      title: "Register",
      isLogin: isLogin,
    });
  }

  if (fileobj.size >= 2048 * 1024) {
    return res.render("signup", {
      isError: true,
      error: "profile photo should be less than 2 MB ",
      title: "Register",
      isLogin: isLogin,
    });
  }

  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.render("signup", {
        isError: true,
        error: "email id is already exist please login ",
        title: "Register",
        isLogin: isLogin,
      });
    }

    let uploadPath = path.join(__dirname, "../public/upload/", fileobj.name);
    console.log(uploadPath);
    let filename = fileobj.name;

    fileobj.mv(uploadPath, function (err) {
      if (err) {
        return res.render("signup", {
          isError: true,
          error: "Error in Profile Picture Upload",
          title: "Register",
          isLogin: isLogin,
        });
      }

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          User.create({
            name,
            username,
            email,
            password: hash,
            gender,
            address,
            dob,
            city,
            profile: filename,
          }).then((user) => {
            console.log(user._id);
            req.session.userid = user._id;
            res.redirect("/profile");
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
      res.render("profile", {
        user: user,
        title: "Profile",
        isLogin: isLogin,
      });
    });
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
      res.render("edit-profile", {
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
  let { name, username, gender, dob, address, city } = req.body;
  if (!name || !username || !gender || !dob || !address || !city) {
    return res.render("edit-profile", {
      isError: true,
      error: "Please fill up all the fields",
      isLogin: isLogin,
      title: "Edit Profile",
    });
  }

  const fileobj = req.files.profile;
  if (
    fileobj.mimetype != "image/jpg" &&
    fileobj.mimetype != "image/jpeg" &&
    fileobj.mimetype != "image/png"
  ) {
    return res.render("signup", {
      isError: true,
      error: "profile photo should be image file ",
      isLogin: isLogin,
      title: "Edit Profile",
    });
  }

  if (fileobj.size >= 2048 * 1024) {
    return res.render("signup", {
      isError: true,
      error: "profile photo should be less than 2 MB ",
      isLogin: isLogin,
      title: "Edit Profile",
    });
  }

  let uploadPath = path.join(__dirname, "../public/upload/", fileobj.name);
  console.log(uploadPath);
  let filename = fileobj.name;

  fileobj.mv(uploadPath, function (err) {
    if (err) {
      return res.render("signup", {
        isError: true,
        error: "Error in Profile Picture Upload",
        isLogin: isLogin,
        title: "Edit Profile",
      });
    }

    let userid = req.params.id;
    User.findByIdAndUpdate(userid, {
      name,
      username,
      gender,
      dob,
      address,
      city,
      profile: filename,
    })
      .then((user) => {
        res.redirect("/profile");
      })
      .catch((err) => {
        next(err);
      });
  });
};

exports.getLogout = function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
};

exports.getChangePassword = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  res.render("change-password", {
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
      console.log(user);
      console.log(typeof old_password);
      console.log(typeof user.password);
      bcrypt
        .compare(old_password, user.password)
        .then((result) => {
          console.log(result);
          if (!result) {
            return res.render("change-password", {
              isError: true,
              error: "Old Password is wrong please corrret it.!",
              isLogin: isLogin,
              title: "Change Password",
            });
          }

          if (new_password != repeat_new_password) {
            return res.render("change-password", {
              isError: true,
              error: "new password & repeat new password must be same",
              isLogin: isLogin,
              title: "Change Password",
            });
          }

          if (old_password == new_password) {
            return res.render("change-password", {
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
                  res.redirect("/profile");
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
  res.render("forgot-password", {
    title: "Forgot Password",
    isLogin: isLogin,
    isAdmin: req.session.isAdmin,
  });
};

exports.postForgotPassword = async function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }

  let { email } = req.body;
  if (!email) {
    return res.render("forgot-password", {
      title: "Forgot Password",
      isLogin: isLogin,
      isError: true,
      error: "Please Enter Email",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.render("forgot-password", {
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
    await sendEmail(user.email, "Password reset", link);
    res.render("login", {
      isLogin: isLogin,
      isSuccess: true,
      successMsg: "Forgot Password Link Have Been Sent To Your Email !!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getForgotPasswordForm = function (req, res, next) {
  res.render("forgot-password-form", { title: "Forgot Password" });
};

exports.postForgotPasswordForm = async function (req, res, next) {
  let { userid } = req.params;

  let { new_password, repeat_new_password } = req.body;

  if (new_password != repeat_new_password) {
    return res.render("login", {
      isError: true,
      error: "new password & repeat new password must be same",

      title: "Forgot Password",
    });
  }

  const user = await User.findById(req.params.userid);
  console.log("user " + user);
  if (!user) {
    return res.render("login", {
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
    return res.render("login", {
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
              res.redirect("/login");
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
