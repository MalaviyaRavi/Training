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
// const validateCsvData = require("../../utility/csvUtil");
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
    console.log("req.files", req.files);
    let fileIds = [];
    let files = req.files;
    let filesData = {};
    let fileCount = 1;
    for (const file of files) {


      let records = await csv({
        noheader: true
      }).fromFile(file.path);

      let fileDoc = await CsvMetaData.create({
        uploadBy: req.user.userId,
        Name: file.filename,
        filePath: file.path,
        totalRecords: records.length
      })

      fileIds.push(fileDoc._id);

      filesData[`file${fileCount++}`] = {
        fileId: fileDoc._id,
        fileName: file.filename,
        csvHeaderField: Object.keys(records[0]),
        firstRow: Object.values(records[0]),
        secondRow: Object.values(records[1]),
      }
    }

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
      filesData: filesData,
      fileIds: fileIds,
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

    let filesData = JSON.parse(req.body.data);

    for (const filesDataKey in filesData) {
      let fileData = filesData[filesDataKey];
      await CsvMetaData.updateOne({
        _id: fileData.fileId
      }, {
        $set: {
          FieldMapping: fileData.fieldMap,
          skipRow: fileData.skipRow
        }
      })
    }


    // let file = await CsvMetaData.findOne({
    //   _id: fileId
    // })
    // let filePath = path.join(__dirname, "..", "..", "public", "csvs", file.Name);
    // let records = await csv({
    //   noheader: true
    // }).fromFile(filePath);

    // console.log(records);

    // console.log(skipRow, typeof skipRow, "lifdgulirdf");


    res.json({
      type: "success",
      statusCode: 200,
      message: `files uploaded successfully with fieldmapping`
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
        $match: {
          FieldMapping: {
            $ne: null
          }
        }
      },

      {
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
      },
    ])

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

exports.deleteFile = async function (req, res, next) {
  console.log(req.body);

  let fileIds = req.body['fileIds[]'];

  let filesPath = await CsvMetaData.find({
    _id: {
      $in: fileIds
    }
  }).select("filePath -_id")


  filesPath = filesPath.map(function (doc) {
    return doc.filePath
  })

  console.log(filesPath);
  await CsvMetaData.deleteMany({
    _id: {
      $in: fileIds
    }
  })


  filesPath.map(function (path) {
    fs.unlinkSync(path)
  })


  console.log("fileDelete");
  res.json({
    success: true,
    message: "file deleted from server"
  })
}