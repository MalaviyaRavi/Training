const User = require("../../models/user");
// const CsvMetaData = require("../../models/csvMetaData");
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
const validateCsvData = require("../../utility/csvUtil");
const CsvMetaData = require("../../models/csvMetaData");
const Field = require("../../models/field");

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

exports.uploadCsv = async function (req, res, next) {
  try {

    let fileName = req.file.filename;
    let file = await CsvMetaData.create({
      uploadBy: req.user.userId,
      Name: fileName
    })
    let filePath = path.join(__dirname, "..", "..", "public", "csvs", fileName);
    let users = await csv({
      noheader: true
    }).fromFile(filePath);

    let allDbFields = Object.keys(User.schema.paths);
    let fieldsToBeIgnore = ["_id", "password", "__v", "addedBy"];
    let dbFieldsForCsv = allDbFields.filter(function (field) {
      return !fieldsToBeIgnore.includes(field);
    })
    let fieldDoc = await Field.findOne({});

    if (fieldDoc) {
      dbFieldsForCsv = dbFieldsForCsv.concat(fieldDoc.fields);
    }

    res.json({
      type: "success",
      statusCode: 200,
      dbFields: dbFieldsForCsv,
      csvHeaderField: Object.keys(users[0]),
      firstRow: Object.values(users[0]),
      secondRow: Object.values(users[1]),
      fileId: file._id,
      message: config.errorMsgs["200"],
    });
  } catch (error) {
    console.log(error);
    return res.json({
      type: "error",
      statusCode: 500,
      message: config.errorMsgs["500"],
    });
  }
};

exports.createFileMetadata = async function (req, res, next) {
  try {
    let {
      fileId,
      skipRow
    } = req.query;
    let fieldMap = req.body;

    let file = await CsvMetaData.findOne({
      _id: fileId
    })
    let filePath = path.join(__dirname, "..", "..", "public", "csvs", file.Name);
    let records = await csv({
      noheader: true
    }).fromFile(filePath);
    console.log(skipRow, typeof skipRow);
    if (skipRow == "true") {
      records = records.slice(1);
    }

    // let cleanedData = await validateCsvData(records, fieldMap, fileId);
    // console.log("cleanded", cleanedData);

    // let users = await User.insertMany(cleanedData.validRecords);
    // let totalUploadedRecords = users.length;

    await CsvMetaData.updateOne({
      _id: fileId
    }, {
      $set: {
        totalRecords: records.length,
        filePath,
        FieldMapping: fieldMap,
        skipRow: skipRow
      }
    })


    res.json({
      type: "success",
      statusCode: 200,
      message: `${file.name} uploaded successfully with fieldmapping`
    })

  } catch (error) {
    console.log(error);
    res.json({
      type: "error",
      statusCode: 500,
    })
  }
}


exports.addNewField = async function (req, res, next) {
  let {
    newField
  } = req.body;

  let dbFields = Object.keys(User.schema.paths)

  let fieldDoc = await Field.findOne({});

  if (fieldDoc) {
    dbFields = dbFields.concat(fieldDoc.fields);
  }

  let isFieldExist = dbFields.includes(newField);


  if (isFieldExist) {
    return res.json({
      type: "error",
      message: "field already exist in schema"
    })
  }


  try {
    await Field.updateOne({}, {
      $addToSet: {
        "fields": newField
      }
    }, {
      "upsert": true
    });

    res.json({
      type: "success",
      message: "new field added successfully"
    })
  } catch (error) {
    console.log(error);
    res.json({
      type: "error",
      message: "error in field adding"
    })
  }





}

exports.getFiles = async function (req, res, next) {
  try {

    let files = await CsvMetaData.aggregate([{
      $project: {
        Name: "$Name",
        status: "$status",
        parsedRows: "$parsedRows",
        duplicateRecords: "$duplicateRecords",
        duplicateRecordsInCsv: "$duplicateRecordsInCsv",
        discardredRecords: "$discardredRecords",
        totalUploadedRecords: "$totalUploadedRecords",
        totalRecords: "$totalRecords",
        percentUpload: {
          $round: [{
            $multiply: [{
              $divide: ["$parsedRows", "$totalRecords"]
            }, 100]
          }, 0]
        },
      }
    }, ])


    console.log(files);



    res.json({
      type: "success",
      files: files
    })
  } catch (error) {
    console.log(error);
    res.json({
      type: "error",
      message: "something went wrong"
    })
  }
}


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