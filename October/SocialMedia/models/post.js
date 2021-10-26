const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    postTitle: String,
    postDescription: String,
    postImage: String,
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
