const cron = require('node-cron');
module.exports = function (time) {
    let task = cron.schedule(time, async function () {
        console.log("test cron");
    }, {
        scheduled: false
    });
    task.start();
}