const mongoose = require("mongoose");

const citySchena = mongoose.Schema({
  cityname: String,
});

module.exports = mongoose.model("city", citySchena);
