const converter = require("json2csv");
const user = require("../models/user");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

function convertUTCtoIST(UTC) {
  return moment(UTC).utcOffset("+05:30").format("YYYY-MM-DD HH:mm a");
}

const { parse } = require("json2csv");

const fields = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Gender",
    value: "gender",
  },
  {
    label: "Address",
    value: "address",
  },
  {
    label: "Interest",
    value: "interest",
  },
  {
    label: "Hobbies",
    value: "hobbies",
  },
  {
    label: "CreatedAt",
    value: function (field) {
      return convertUTCtoIST(field.createdAt);
    },
  },
];
const opts = { fields };

exports.generateCsv = async function (users) {
  let tempUsers = [];

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    tempUsers[userIndex] = Object.assign({}, users[userIndex]);
  }

  for (let user of tempUsers) {
    user.hobbies = user.hobbies.join(",");
  }
  const csv = parse(tempUsers, opts);
  let fileName =
    "users-" +
    moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm a") +
    ".csv";
  let csvStoragePath = path.join(__dirname, "..", "public", "csvs", fileName);

  console.log(csvStoragePath);
  fs.writeFileSync(csvStoragePath, csv);
};
