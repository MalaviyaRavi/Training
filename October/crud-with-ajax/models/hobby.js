const mongoose = require("mongoose");

const hobbySchema = mongoose.Schema({
  hobbyname: String,
});

module.exports = mongoose.model("hobby", hobbySchema);
