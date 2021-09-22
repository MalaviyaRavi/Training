const mongoos = require("mongoose");
const Schema = mongoos.Schema;

const userSchema = Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoos.model("User", userSchema);

module.exports = User;
