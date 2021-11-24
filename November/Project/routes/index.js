const express = require("express");
const router = express.Router();

const userModel = require("../models/user");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let users = await userModel.find().lean();

    res.render("pages/index", { title: "Express", users: users });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async function (req, res, next) {
  let usersData = { ...req.body };
  let users = [];

  try {
    for (
      let fieldIndex = 0;
      fieldIndex < Object.keys(usersData).length;
      fieldIndex += 2
    ) {
      let user = {};
      let field1 = Object.keys(usersData)[fieldIndex].split("-")[0];
      let field2 = Object.keys(usersData)[fieldIndex + 1].split("-")[0];
      user[field1] = usersData[Object.keys(usersData)[fieldIndex]];
      user[field2] = usersData[Object.keys(usersData)[fieldIndex + 1]];
      users.push(user);
    }

    await userModel.insertMany(users);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

// if (Array.isArray(username) && Array.isArray(password)) {
//   for (
//     let usernameIndex = 0, passwordIndex = 0;
//     usernameIndex < username.length, passwordIndex < password.length;
//     usernameIndex++, passwordIndex++
//   ) {
//     users[usernameIndex] = {
//       username: username[usernameIndex],
//       password: password[passwordIndex],
//     };
//   }
// } else {
//   users[0] = {
//     username,
//     password,
//   };
// }
