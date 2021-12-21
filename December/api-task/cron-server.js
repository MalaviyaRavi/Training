const express = require('express');

const config = require("./config/config.json")
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
global.io = new Server(server);

io.on('connection', function () {
    console.log("connected with socket");
})
async function connectDb() {
    try {
        await mongoose.connect(
            `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`
        );
        console.log("database connected");
        server.listen(4000, async function () {
            console.log("app started");
            // require("./services/generateAdmin");
            require("./cron-jobs/upload-csv");
        });
    } catch (error) {
        console.log(error);
        console.log("database connection failed");
    }
}


connectDb();