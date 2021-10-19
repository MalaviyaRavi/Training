const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
  statename: String,
  _cities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "city",
    },
  ],
});

module.exports = mongoose.model("state", stateSchema);
