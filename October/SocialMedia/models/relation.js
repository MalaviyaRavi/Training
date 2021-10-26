const mongoose = require("mongoose");

const followerSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  isFollower: {
    type: Boolean,
  },
});

module.exports = mongoose.model("relation", followerSchema);
