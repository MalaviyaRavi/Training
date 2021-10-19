const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: String,
    username: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("usermodel", userSchema);

module.exports = User;
