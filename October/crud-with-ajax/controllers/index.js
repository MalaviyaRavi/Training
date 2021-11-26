const mongoose = require("mongoose");
//models
const hobbyModel = require("../models/hobby");
const interestModel = require("../models/interest");
const userModel = require("../models/user");
const configurationModel = require("../models/configuration");
const fs = require("fs");
const path = require("path");
exports.signup = async function (req, res, next) {
  try {
    let hobbies = await hobbyModel.find().lean();
    let interests = await interestModel.find().lean();
    let configurationData = await configurationModel.findOne();

    let cronStatus =
      configurationData.configuration.cronConfiguration.cronStatus;
    res.render("index", { title: "AJAX CRUD", hobbies, interests, cronStatus });
  } catch (error) {
    next(error);
  }
};
