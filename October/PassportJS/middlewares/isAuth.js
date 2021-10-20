const ValidationModel = require("../models/validation-model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
exports.isAuth = function (req, res, next) {
  if (!req.cookies.jwt) {
    return res.redirect("/validationlogin");
  }
  let token = req.cookies.jwt;
  jwt.verify(token, "ravi", async function (err, userid) {
    console.log(userid);
    let user = await ValidationModel.findOne({ userid });
    console.log("user");
    req.user = user;
    next();
  });
};
