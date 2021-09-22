const mongoose = require("mongoose");
var createError = require("http-errors");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/todoApp");
    console.log("Database Connected");
  } catch (error) {
    next(createError(500));
  }
}

connectDB();
