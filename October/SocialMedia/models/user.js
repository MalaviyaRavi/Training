const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    mobile: {
      type: String,
      unique: true,
    },
    gender: String,
    socketids: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
