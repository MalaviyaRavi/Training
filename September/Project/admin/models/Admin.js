const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model("admin", adminSchema, "admins");
