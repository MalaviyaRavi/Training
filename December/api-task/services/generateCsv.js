const converter = require("json2csv");
const user = require("../models/user");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

// function convertUTCtoIST(UTC) {
//   return moment(UTC).utcOffset("+05:30").format("YYYY-MM-DD HH:mm a");
// }

const {
  parse
} = require("json2csv");

const fields = [{
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Mobile Number",
    value: "mobile",
  },
];
const opts = {
  fields
};

exports.generateCsv = function (users) {
  const csv = parse(users, opts);
  let fileName =
    "users-" +
    moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm a") +
    ".csv";
  let csvStoragePath = path.join(__dirname, "..", "public", "csvs", fileName);

  console.log(csvStoragePath);
  fs.writeFileSync(csvStoragePath, csv);
  return fileName;
};