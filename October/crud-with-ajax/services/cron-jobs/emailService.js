const CronJob = require("cron").CronJob;

const emailQueryModel = require("../../models/emailQuery");
const userModel = require("../../models/user");

const sendMail = require("../send-mail");
const { generateCsv } = require("../generate-csv");

// async function getUsers() {
//   try {
//     let records = await emailQueryModel
//       .find({
//         $and: [{ status: "pending" }, { count: { $ne: 3 } }],
//       })
//       .limit(1);
//     return records;
//   } catch (error) {
//     return [];
//   }
// }

const job = new CronJob(
  "*/1 * * * *",
  async function () {
    try {
      console.log("hello");
      let records = await emailQueryModel
        .find({
          $and: [{ status: "pending" }, { count: { $lt: 3 } }],
        })
        .limit(1);

      let record = records[0];
      console.log("record", record);
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
          } else {
            await emailQueryModel.updateOne(
              { _id: record._id },
              { $set: { status: "completed" } }
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  null,
  true,
  "America/Los_Angeles"
);

job.start();
