const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validationSchema = new Schema({
  email: String,
  username: String,
  password: String,
  gender: String,
  city: String,
  image: String,
  mobile: String,
});

const Validate = mongoose.model("validationmodel", validationSchema);

module.exports = Validate;
