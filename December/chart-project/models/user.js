const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  phone: String,
  isActive: Boolean,
});

module.exports = mongoose.model("user", userSchema);
