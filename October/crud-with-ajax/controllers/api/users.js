const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const userModel = require("../../models/user");
exports.signup = async function (req, res, next) {
  let image = req.file.filename;
  let { firstname, lastname, address, gender, interest } = req.body;
  let hobbies = req.body.hobby.split(",");
  console.log(image, firstname, lastname, address, gender, interest, hobbies);

  try {
    let user = await userModel.create({
      firstname,
      lastname,
      address,
      gender,
      interest,
      hobbies,
      image,
    });
    let name = firstname + " " + lastname;

    res.json({
      success: true,
      message: "user added successfully",
      data: { name, image, gender, address, id: user._id },
    });
  } catch (error) {
    res.json({ success: false, message: "something went wrong in user add." });
  }
};

exports.deleteUser = async function (req, res, next) {
  console.log(req.params.id);

  try {
    let user = await userModel.findOneAndDelete({ _id: req.params.id });

    fs.unlinkSync("./public/img/" + user.image);

    res.json({
      success: true,
      message: "user successfully deleted",
      data: { id: user._id },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong in user deletion",
    });
  }
};
