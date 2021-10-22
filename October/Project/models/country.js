const mongoose = require("mongoose");

const countrySchena = mongoose.Schema({
  countryname: String,
  _states: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "state",
    },
  ],
});

module.exports = mongoose.model("country", countrySchena);
