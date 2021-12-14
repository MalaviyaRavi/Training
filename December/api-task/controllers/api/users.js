const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { generateCsv } = require("../../services/generateCsv");
const csv = require("csvtojson");
const path = require("path");

exports.login = async function (req, res, next) {
  try {
    let { emailOrMobile, password } = req.body;
    let user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });
    if (!user) {
      return res.json({
        type: "error",
        statusCode: 401,
        message: config.errorMsgs["401"],
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({
        type: "error",
        statusCode: 401,
        message: config.errorMsgs["401"],
      });
    }

    //generate jwt token
    let jsonWebToken = jwt.sign(
      { userId: user._id, userEmail: user.email },
      config.JWT.secret
    );
    return res.json({
      type: "success",
      statusCode: 200,
      message: "user logged in successfully",
      token: jsonWebToken,
    });
  } catch (error) {
    return res.json({
      type: "error",
      statusCode: 500,
      message: config.errorMsgs["500"],
    });
  }
};

exports.getAllUsers = async function (req, res, next) {
  try {
    let users = await User.find({ email: { $ne: req.user.userEmail } });
    if (req.query.export) {
      let csvName = generateCsv(users);
      console.log(csvName);
      return res.json({
        type: "exportToCsv",
        csvFileName: csvName,
        statusCode: 200,
      });
    }

    res.json({
      type: "success",
      statusCode: 200,
      users: users,
      loggedInUser: req.user.userEmail,
    });
  } catch (error) {
    res.json({
      type: "error",
      statusCode: 500,
      message: config.errorMsgs["500"],
    });
  }
};

exports.checkExistance = async function (req, res, next) {
  try {
    let user = await User.findOne(req.query);
    if (user) {
      return res.send(false);
    }
    res.send(true);
  } catch (error) {
    res.send(false);
  }
};

exports.addUser = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.json({
      type: "error",
      statusCode: 422,
      message: errors.array()[0].msg,
    });
  }
  try {
    let userDetails = {
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 8),
      email: req.body.email,
      mobile: req.body.mobile,
    };
    let user = await User.create(userDetails);
    return res.json({
      type: "success",
      statusCode: 201,
      message: "user added successfully",
      user,
    });
  } catch (error) {
    return res.json({
      type: "error",
      statusCode: 500,
      message: "something went wrong in adding user try again",
    });
  }
};

exports.logout = async function (req, res, next) {
  res.clearCookie("authToken");
  res.json({ type: "success", message: "user logged out!!!" });
};

exports.uploadCsv = async function (req, res, next) {
  try {
    let fileName = req.file.filename;
    let filePath = path.join(__dirname, "..", "..", "public", "csvs", fileName);
    let users = await csv().fromFile(filePath);
    let validUsersList = [];
    let validUsers = 0,
      inValidUsers = 0,
      duplicateUsers = 0;
    console.log(users);
    for (const user of users) {
      if (user.Name && user.Email && user.Mobile) {
        validUsers++;
        let isExist =
          (await User.countDocuments({ email: user.Email })) > 1 ? true : false;
        if (isExist) {
          duplicateUsers++;
          validUsers--;
        } else {
          validUsersList.push(user);
        }
      } else {
        inValidUsers++;
      }
    }
  } catch (error) {}
};
