const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/ecom";
const DB_OPTIONS = {
  user: "ecom",
  pass: "ecom",
};
mongoose.connect(DB_URL, DB_OPTIONS);

const db = mongoose.connection;

db.once("connecting", function () {
  console.log("Database Connecting");
});

db.once("connected", function () {
  console.log("Database Connected");
});

db.once("open", function () {
  console.log("Database Connection Open");
});

require("./models/User");

db.on("disconnecting", () => {
  console.log("connection disconnecting");
});

db.on("disconnected", () => {
  console.log("connection disconnected");
});

db.on("close", () => {
  console.log("connection close");
});
