const express = require('express');
const CronJob = require('cron').CronJob;
const config = require("./config/config.json")
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
    Server
} = require("socket.io");

const {
    createClient
} = require('redis');

(async () => {
    global.publisher = createClient({
        url: 'redis://localhost:6379/0'
    });

    await publisher.connect();
    console.log("publisher connecteed");
})();


let cronSchedule = config.cron.scheduler
// console.log(typeof cronSchedule);
let allFiles = Object.keys(config.cron.files);
let filesTobeScheduled = []
allFiles.forEach(function (file) {
    if (config.cron.files[file].active) {
        filesTobeScheduled.push({
            name: file,
            time: config.cron.files[file].time
        })
    }
})

async function connectDb() {
    try {
        await mongoose.connect(
            `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`
        );
        console.log("database connected");
        if (cronSchedule == "on" && filesTobeScheduled.length) {
            publisher.publish("cronNotification", JSON.stringify({
                message: "cronStart"
            }))
            for (const file of filesTobeScheduled) {
                require(`./cron-jobs/${file.name}`)(file.time);
            }
        }

    } catch (error) {
        console.log(error);
        console.log("database connection failed");
    }
}

connectDb();