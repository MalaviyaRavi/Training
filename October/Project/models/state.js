const mongoose = require("mongoose");

const stateSchena = mongoose.Schema({
  statename: String,
  _cities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "city",
    },
  ],
});

module.exports = mongoose.model("state", stateSchena);
