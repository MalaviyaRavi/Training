const CronJob = require("cron").CronJob;
const path = require("path");
const fs = require("fs");

const job = new CronJob(
  "*/1 * * * *",
  async function () {
    try {
      let configurationData = await configurationModel.findOne();
      let cronStatus =
        configurationData.configuration.cronConfiguration.cronStatus;

      console.log(cronStatus);
      if (cronStatus) {
        console.log("cron started");
        let records = await emailQueryModel
          .find({
            $and: [{ status: "pending" }, { count: { $lt: 3 } }],
          })
          .limit(1);

        let record = records[0];

        if (record) {
          let usersForCsv = await userModel.aggregate(JSON.parse(record.query));
          let csvFileName = await generateCsv(usersForCsv);
          console.log(csvFileName);
          try {
            let text = `click to below link <html><a href='http://192.168.1.116:3000/csvs/${csvFileName}'>CSV LINK</a><html>`;
            let mailResponse = sendMail(record.email, "users csv", text);
            let info = await mailResponse;

            if (info.rejected.length) {
              await emailQueryModel.updateOne(
                { _id: record._id },
                { $inc: { count: 1 } }
              );
              console.log("error in mail sent");
            } else {
              await emailQueryModel.updateOne(
                { _id: record._id },
                { $set: { status: "completed" } }
              );
              console.log("mail sent");
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        console.log("cron stopped");
      }
    } catch (error) {
      console.log(error);
    }
  },
  null,
  true,
  "Asia/Kolkata"
);

job.start();
