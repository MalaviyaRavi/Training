const converter = require("json2csv");
const user = require("../models/user");
const fs = require("fs");
const path = require("path");

// const jsonToCsv = require("../helper/promises");

const { parse } = require("json2csv");

const fields = ["name", "gender", "address", "interest", "hobbies"];
const opts = { fields };

exports.generateCsv = async function (users) {
  console.log("dfvdxgvb", users);
  let tempUsers = [];

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    tempUsers[userIndex] = Object.assign({}, users[userIndex]);
  }

  for (let user of tempUsers) {
    user.hobbies = user.hobbies.join(",");
  }
  // console.log(tempUsers);

  const csv = parse(tempUsers, opts);

  // console.log(tempUsers);

  let currentdate = new Date();
  let currentTime =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    "@" +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ".csv";

  let csvStoragePath = path.join(
    __dirname,
    "..",
    "public",
    "csvs",
    currentTime
  );

  console.log(csvStoragePath);
  fs.writeFileSync(csvStoragePath, csv);
};
