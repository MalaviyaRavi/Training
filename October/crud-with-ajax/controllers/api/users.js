const mongoose = require("mongoose");
const fs = require("await-fs");
const path = require("path");
const moment = require("moment");

//user model
const userModel = require("../../models/user");

//services
const sendMail = require("../../services/send-mail");
const { generateCsv } = require("../../services/generate-csv");

//save and update user
exports.saveUser = async function (req, res, next) {
  let image = req.file ? req.file.filename : null;

  let { firstname, lastname, address, gender, interest, hobby, userId } =
    req.body;
  let userData = {
    firstname,
    lastname,
    address,
    gender,
    interest,
    hobbies: hobby,
  };

  //if image has been selected by user
  if (image) {
    userData.image = image;
  }

  let name = firstname + " " + lastname;
  try {
    let oldUser = await userModel.findById(userId).select("image");
    //if user doing update opertion
    if (userId) {
      let user = await userModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });

      //delete old image from server during image update
      if (image) {
        fs.unlink("./public/img/" + oldUser.image);
      }

      return res.json({
        isUpdated: true,
        message: "user updated successfully",
        data: { name, image: user.image, gender, address, id: user._id },
      });
    }

    //user doing adding operation
    let user = await userModel.create(userData);
    res.json({
      isAdded: true,
      message: "user added successfully",
      data: { name, image: user.image, gender, address, id: user._id },
    });
  } catch (error) {
    console.log(error);
    res.json({
      hasError: true,
      message: "something went wrong try again.",
      data: null,
    });
  }
};

//delete user
exports.deleteUser = async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    //delete file from server
    if (user.image != "default.png") {
      fs.unlink("./public/img/" + user.image);
    }

    res.json({
      success: true,
      message: "user successfully deleted",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong try again",
    });
  }
};

//get user data by id
exports.getUserById = async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong try again",
      data: null,
    });
  }
};

//get users by query
exports.getUsersByQuery = async function (req, res, next) {
  let queryParams = { ...req.query };
  let hasPrev = false;
  let hasNext = false;

  let totalUsersCount = await userModel.find({ isDeleted: false }).count();

  let usersPerPage = 3;
  let usersToBeSkip = (queryParams.page - 1) * usersPerPage;
  let sort = {};
  let query = [
    { $match: { isDeleted: false } },
    {
      $project: {
        name: { $concat: ["$firstname", " ", "$lastname"] },
        gender: 1,
        image: 1,
        address: 1,
        hobbies: 1,
        interest: 1,
        createdAt: 1,
      },
    },
  ];

  let matchObject = {};
  try {
    //searching
    if (queryParams.search || queryParams.gender) {
      if (queryParams.search) {
        matchObject["$or"] = [
          { name: { $regex: queryParams.search } },
          { address: { $regex: queryParams.search } },
          { gender: { $regex: queryParams.search } },
          { interest: { $eq: queryParams.search } },
          { hobbies: queryParams.search },
        ];
      }
      if (queryParams.gender) {
        matchObject["gender"] = queryParams.gender;
      }
      query.push({
        $match: matchObject,
      });
      totalUsersCount = (await userModel.aggregate(query)).length;
    }

    let sortOrder = "desc";
    if (queryParams.sortBy && queryParams.sortingOrder) {
      let order = queryParams.sortingOrder == "asc" ? 1 : -1;
      sortOrder = queryParams.sortingOrder == "desc" ? "asc" : "desc";
      sort[queryParams.sortBy] = order;
      query.push({
        $sort: sort,
      });
    }

    if (queryParams.export || queryParams.email) {
      let usersForCsv = await userModel.aggregate(query);

      generateCsv(usersForCsv);
      let csvFileName =
        "users-" +
        moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm a") +
        ".csv";

      if (queryParams.email) {
        let text = `click to below link <html><a href='http://192.168.1.116:3000/csvs/${csvFileName}'>CSV LINK</a><html>`;
        await sendMail(queryParams.email, "csv file link", text);
        return res.json({
          type: "success",
          isMailSent: true,
        });
      }
      return res.json({
        type: "success",
        isDownload: true,
        csvFileName: csvFileName,
      });
    }

    //for pagination
    Array.prototype.push.apply(query, [
      {
        $skip: usersToBeSkip,
      },
      {
        $limit: usersPerPage,
      },
    ]);

    let users = await userModel.aggregate(query);

    //for pagination
    let numOfPages = Math.ceil(totalUsersCount / 3);
    if (queryParams.page > 1) {
      hasPrev = true;
    }
    if (queryParams.page < numOfPages) {
      hasNext = true;
    }
    let pages = [];
    for (let i = 0; i < numOfPages; i++) {
      pages[i] = i + 1;
    }

    res.render("users", {
      layout: false,
      users: users,
      hasPrev,
      hasNext,
      currentActivePage: queryParams.page,
      pages,
      sortOrder,
    });
  } catch (error) {
    console.log(error);
    res.render("users", {
      layout: false,
      users: null,
    });
  }
};

exports.getUserDetailsById = async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id).lean();
    res.render("userDetails", { layout: false, user });
  } catch (error) {}
};
