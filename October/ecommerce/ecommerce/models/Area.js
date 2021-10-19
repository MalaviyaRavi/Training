const mongoose = require("mongoose");

const areaSchema = mongoose.Schema({
  areaname: String,
});

module.exports = mongoose.model("area", areaSchema);
