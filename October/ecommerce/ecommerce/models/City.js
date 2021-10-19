const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  cityname: String,
  _areas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "area",
    },
  ],
});

module.exports = mongoose.model("city", citySchema);
