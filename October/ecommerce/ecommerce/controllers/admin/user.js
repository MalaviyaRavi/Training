const State = require("../../models/State");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

exports.getAddUser = async function (req, res, next) {
  let states = await State.find().lean();
  res.render("admin/user/add-user", { title: "Add User", states });
};

exports.postAdduser = async function (req, res, next) {
  let { username, useremail, userpassword, useraddress, _area, usergender } =
    req.body;
  let userphoto = req.file.originalname;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(userpassword, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      userpassword = hash;
      User.create({
        username,
        useremail,
        userpassword,
        useraddress,
        _area,
        userphoto,
        usergender,
      })
        .then((user) => {
          res.redirect("/admin/user/add");
        })
        .catch((err) => next(EvalError));
    });
  });
};

exports.getDisplayUser = async function (req, res, next) {
  const users = await User.find().lean();
  res.render("admin/user/display-user", { title: "Display User", users });
};

exports.getEditUser = async function (req, res, next) {
  let id = req.params.id;
  let user = await User.findById(id).lean();
  let states = await State.find().lean();
  res.render("admin/user/edit-user", { title: "Edit User", user, states });
};

exports.postEditUser = async function (req, res, next) {
  let id = req.params.id;
  console.log(req.body);
  if (!req.file) {
    await User.findByIdAndUpdate(id, { ...req.body });
    return res.redirect("/admin/user/display");
  }
  await User.findByIdAndUpdate(id, {
    ...req.body,
    userphoto: req.file.userphoto,
  });
  res.redirect("/admin/user/display");
};

exports.getDeleteUser = async function (req, res, next) {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin/user/display");
};
