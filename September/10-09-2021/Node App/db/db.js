const mongoose = require("mongoose");
require("dotenv").config("../");
const DB_URI = process.env.DB_URL;

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Mongodb database connected successfully");
  })
  .catch((error) => {
    console.log("ERROR!!!, Mongodb database connection Failed", error.message);
  });
