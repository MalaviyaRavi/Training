const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect("mongodb://ecom:ecom@localhost:27017/ecom");
    //await mongoose.connect("mongodb://localhost:27017/ecom2");
    console.log("database connected");
  } catch (error) {
    console.log("Database Connection Error");
  }
}

connectDb();
