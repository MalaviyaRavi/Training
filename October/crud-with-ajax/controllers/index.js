const mongoose = require("mongoose");
//models
const hobbyModel = require("../models/hobby");
const interestModel = require("../models/interest");
const userModel = require("../models/user");

exports.signup = async function (req, res, next) {
  try {
    let hobbies = await hobbyModel.find().lean();
    let interests = await interestModel.find().lean();
    let users = await userModel.aggregate([
      {
        $project: {
          name: { $concat: ["$firstname", " ", "$lastname"] },
          gender: 1,
          image: 1,
          address: 1,
        },
      },
    ]);
    console.log(users);
    res.render("index", { title: "AJAX CRUD", hobbies, interests, users });
  } catch (error) {
    next(error);
    //will be handle later
  }
};
