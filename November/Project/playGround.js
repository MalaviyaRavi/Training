var CronJob = require("cron").CronJob;
var job = new CronJob(
  "* * * * * * *",
  function () {
    console.log("You will see this message every second");
  },
  null,
  true,
  "America/Los_Angeles"
);
// Use this if the 4th param is default value(false)
job.start();
