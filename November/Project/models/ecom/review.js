const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  reviewBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  numbOfStar: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  reviewText: {
    type: String,
  },
  reviewImage: [String],
});
