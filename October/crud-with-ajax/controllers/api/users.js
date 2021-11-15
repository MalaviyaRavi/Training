const mongoose = require("mongoose");
const fs = require("await-fs");
const path = require("path");

//user model
const userModel = require("../../models/user");

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
    let user = await userModel.findByIdAndDelete(req.params.id);

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
  console.log(req.query);
  let { sortBy, sortingOrder, search, page } = req.query;

  let totalUsersCount = await userModel.find().count();

  let usersPerPage = 3;
  let usersToBeSkip = (page - 1) * usersPerPage;
  let sort = {};
  let query = [];
  try {
    console.log(search !== "undefined");
    if (search != "undefined" && search.length != 0) {
      console.log("search");
      query.push({
        $match: {
          $or: [
            { firstname: { $regex: search } },
            { lastname: { $regex: search } },
            { address: { $regex: search } },
            { gender: { $regex: search } },
          ],
        },
      });

      let count = await userModel.aggregate(query).count("count");
      totalUsersCount = count[0].count;
    }

    Array.prototype.push.apply(query, [
      {
        $project: {
          name: { $concat: ["$firstname", " ", "$lastname"] },
          gender: 1,
          image: 1,
          address: 1,
        },
      },
      {
        $skip: usersToBeSkip,
      },
      {
        $limit: usersPerPage,
      },
    ]);

    if (sortBy != "undefined" && sortingOrder != "undefined") {
      let order = sortingOrder == "asc" ? 1 : -1;
      sort[sortBy] = order;
      query.push({
        $sort: sort,
      });
    }

    let users = await userModel.aggregate(query);
    console.log(users);
    let data = users.length ? users : "No users found!!";
    res.json({ type: "success", data: data, totalUsersCount });
  } catch (error) {
    console.log(error);
    res.json({ type: "error", data: "error during fetching users!!!" });
  }
};
