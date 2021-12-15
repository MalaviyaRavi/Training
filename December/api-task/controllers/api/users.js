const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  body,
  validationResult
} = require("express-validator");
const {
  generateCsv
} = require("../../services/generateCsv");
const csv = require("csvtojson");
const path = require("path");
const fs = require("fs");

exports.login = async function (req, res, next) {
  try {
    let {
      emailOrMobile,
      password
    } = req.body;
    let user = await User.findOne({
      $or: [{
        email: emailOrMobile
      }, {
        mobile: emailOrMobile
      }],
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
    let jsonWebToken = jwt.sign({
        userId: user._id,
        userEmail: user.email
      },
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
    let users = await User.find({
      email: {
        $ne: req.user.userEmail
      }
    });
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
  res.json({
    type: "success",
    message: "user logged out!!!"
  });
};

function checkEmail(email) {
  return email.toLowerCase()
    .match(
      `/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/`
    )
}

function checkMobile(mobile) {
  return mobile.match(`^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$`)
}

exports.uploadCsv = async function (req, res, next) {
  try {
    let fileName = req.file.filename;
    let filePath = path.join(__dirname, "..", "..", "public", "csvs", fileName);
    let users = await csv().fromFile(filePath);

    console.log(users);
    res.json({
      type: "success",
      statusCode: 200,
      firstRow: Object.keys(users[0]),
      secondRow: Object.values(users[0]),
      message: config.errorMsgs["200"],
    });
  } catch (error) {
    return res.json({
      type: "error",
      statusCode: 500,
      message: config.errorMsgs["500"],
    });
  }
};


// exports.uploadCsv = async function (req, res, next) {
//   try {
//     let fileName = req.file.filename;
//     let filePath = path.join(__dirname, "..", "..", "public", "csvs", fileName);
//     let fieldMapping = {
//       Name: "name",
//       Email: "email",
//       "Mobile Number": "mobile",
//     };
//     let users = await csv().fromFile(filePath);
//     let validUsersList = [];
//     let validUsers = 0,
//       inValidUsers = 0,
//       duplicateUsers = 0;

//     for (let userIndex = 0; userIndex < users.length; userIndex++) {
//       let user = users[userIndex];

//       if (user.Name && user.Email && user["Mobile Number"]) {
//         let matchUser = await User.findOne({
//           $or: [{
//             email: user.Email
//           }, {
//             mobile: user["Mobile Number"]
//           }],
//         });

//         let isExist = matchUser ? true : false;

//         if (isExist) {
//           duplicateUsers++;
//         } else {
//           validUsers++;
//           let userObj = {};
//           userObj[fieldMapping["Name"]] = user.Name;
//           userObj[fieldMapping["Email"]] = user.Email;
//           userObj[fieldMapping["Mobile Number"]] = user["Mobile Number"];
//           validUsersList.push(userObj);
//         }
//       } else {
//         inValidUsers++;
//       }
//     }


//     fs.unlinkSync(filePath);

//     if (validUsersList.length > 1000) {

//     }

//     let importedUsers = await User.insertMany(validUsersList);
//     res.json({
//       type: "success",
//       statusCode: 200,
//       message: config.errorMsgs["200"],
//       importedUsers: importedUsers,
//       duplicateUsers,
//       validUsers,
//       inValidUsers,
//     });
//   } catch (error) {
//     return res.json({
//       type: "error",
//       statusCode: 500,
//       message: config.errorMsgs["500"],
//     });
//   }
// };