const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  useremail: String,
  userpassword: String,

  usergender: {
    type: String,
  },
  userphoto: {
    type: String,
    default: "admin.png",
  },

  userrole: {
    type: String,
    enum: ["user", "admin"],
  },
  _area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "area",
  },
});

module.exports = mongoose.model("user", userSchema);
