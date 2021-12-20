const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  password: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "csvmetadata"
  }
}, {
  strict: false,
});

module.exports = mongoose.model("user", userSchema);