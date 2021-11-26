const fs = require("fs");
const { promisify } = require("util");

const emailQueryModel = require("./models/emailQuery");
const userModel = require("./models/user");
// const configurationModel = require("./models/configuration");

const sendMail = require("./services/send-mail");
const { generateCsv } = require("./services/generate-csv");

let readFileAsync = promisify(fs.readFile);

const express = require("express");
const cronServer = express();
const mongoose = require("mongoose");

cronServer.listen(3131, function () {
  console.log("cron server started on 3131");
  mongoose
    .connect("mongodb://admin:admin@localhost:27017/ajaxcrud")
    .then(() => {
      console.log("db for cron Connected");
      (async function loadCronJobCode() {
        eval(
          await readFileAsync("./services/cron-jobs/emailService.js", "utf-8")
        );
      })();
    })
    .catch((err) => {
      throw err;
    });
});
