const userModel = require("../models/user");

exports.isVarified = async function (req, res, next) {
  let userid = req.user._id;
  let user = await userModel.findById(userid);
  if (user.isVarified) {
    next();
    return;
  }
  res.redirect("/varify-account");
};
