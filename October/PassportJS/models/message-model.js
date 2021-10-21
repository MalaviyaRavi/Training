const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    msg: String,
    sender: String,
    receiver: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
