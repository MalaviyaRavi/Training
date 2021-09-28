const mongoose = require("mongoose");
var createError = require("http-errors");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://ecom:ecom@localhost:27017/ecom", /*{user : "admin", pass:"admin"}*/);
    console.log("Database Connected");
  } catch (error) {
    console.log("Error in Database Connection");
  }
}




connectDB();
