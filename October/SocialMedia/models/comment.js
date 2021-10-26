const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    comment: String,
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
