const express = require("express");
const router = express.Router();

const userModel = require("../models/user");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let users = await userModel.find().lean();
    // res.locals.user = "ravi";

    res.render("pages/index", { title: "Users", users: users });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async function (req, res, next) {
  let usersData = { ...req.body };
  let users = [];

  try {
    let user = {};
    for (
      let fieldIndex = 0;
      fieldIndex < Object.keys(usersData).length;
      fieldIndex++
    ) {
      if (fieldIndex == 0) {
        let field = Object.keys(usersData)[fieldIndex].split("-")[0];
        user[field] = usersData[Object.keys(usersData)[fieldIndex]];
        continue;
      }

      if (fieldIndex % 2 == 0 && fieldIndex != 0) {
        let field = Object.keys(usersData)[fieldIndex].split("-")[0];
        user[field] = usersData[Object.keys(usersData)[fieldIndex]];
      } else {
        let field = Object.keys(usersData)[fieldIndex].split("-")[0];
        user[field] = usersData[Object.keys(usersData)[fieldIndex]];
        users.push(user);
        user = {};
      }
    }

    await userModel.insertMany(users);
    // res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
