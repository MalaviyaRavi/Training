const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_socket_id: {
    type: String,
  },
  username: String,
});

module.exports = mongoose.model("chatappuser", userSchema);
