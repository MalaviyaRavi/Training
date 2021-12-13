const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: String,
  description: String,
  postOn: {
    type: Date,
  },
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalViews: Number,
});

module.exports = mongoose.model("post", postSchema);
