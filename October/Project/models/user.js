const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
    index: true,
  },
  password: String,
  gender: String,
  mobile: String,

  _country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "country",
  },

  _state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
  },

  _city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },

  address: String,
});

module.exports = mongoose.model("user", userSchema);
