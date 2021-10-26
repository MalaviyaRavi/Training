const mongoose = require("mongoose");

const commentReplySchema = mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
    replyText: String,
    replyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("commentreply", commentReplySchema);
