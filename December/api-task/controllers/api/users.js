const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

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
        message: "Email/Mobile or Password Invalid",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({
        type: "error",
        statusCode: 401,
        message: "Email/Mobile or Password Invalid",
      });
    }

    //generate jwt token
    let jsonWebToken = jwt.sign(
      { userId: user._id, userEmail: user.email },
      "ravi"
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
      message: "something went",
    });
  }
};

exports.getAllUsers = async function (req, res, next) {
  try {
    // let users = await User.find({ email: { $ne: req.user.userEmail } });
    let users = await User.find();
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
      message: "something went wrong in fetching users data",
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
