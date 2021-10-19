const mongoose = require("mongoose");
const messageSchema = mongoose.Schema(
  {
    text: String,
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatappusers",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatappusers",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
