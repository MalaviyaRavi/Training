const mongoose = require("mongoose");
//models
const hobbyModel = require("../models/hobby");
const interestModel = require("../models/interest");
const userModel = require("../models/user");

exports.signup = async function (req, res, next) {
  try {
    let hobbies = await hobbyModel.find().lean();
    let interests = await interestModel.find().lean();
    res.render("index", { title: "AJAX CRUD", hobbies, interests });
  } catch (error) {
    next(error);
  }
};
