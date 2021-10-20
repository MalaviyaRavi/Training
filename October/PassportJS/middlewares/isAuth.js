const ValidationModel = require("../models/validation-model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
exports.isAuth = function (req, res, next) {
  if (!req.cookies.jwt) {
    return res.redirect("/validationlogin");
  }
  let token = req.cookies.jwt;
  jwt.verify(token, "ravi", async function (err, decoded) {
    console.log("userid");
    let _id = decoded.data;
    let user = await ValidationModel.findOne({ _id });
    console.log("before");
    console.log(req.user);
    req.user = user;
    console.log("after");
    console.log(req.user);
    next();
  });
};
