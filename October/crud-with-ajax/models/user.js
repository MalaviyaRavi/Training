const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  address: String,
  gender: String,
  hobbies: [String],
  interest: String,
  image: String,
});

module.exports = mongoose.model("user", userSchema);
