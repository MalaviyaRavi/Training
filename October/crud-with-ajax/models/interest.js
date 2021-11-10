const mongoose = require("mongoose");

const interestSchema = mongoose.Schema({
  interestname: String,
});

module.exports = mongoose.model("interest", interestSchema);
