const mongoose = require("mongoose");

const emailQuerySchema = mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  email: String,
  query: mongoose.Schema.Types.String,
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("emailquery", emailQuerySchema);
