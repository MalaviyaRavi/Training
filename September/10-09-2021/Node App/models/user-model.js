const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.checkUserExists = function (inputEmail) {
  if (inputEmail == this.email) return true;
  else return false;
};

module.exports = mongoose.model("User", userSchema);
