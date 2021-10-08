const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  gender: String,
  role: {
    type: String,
    enum: ["user", "admin"],
  },
  profile_image: {
    type: String,
    default: "admin.png",
  },
  contact_number: String,
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "area",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
  },
});

module.exports = mongoose.model("user", userSchema);
