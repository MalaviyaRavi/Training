const mongoose = require("mongoose");
async function databaseConnection(URL) {
  try {
    await mongoose.connect(URL);
    console.log("file manager database connected");
  } catch (error) {
    console.log(error);
    console.log("database connection failed");
  }
}

module.exports = databaseConnection;
