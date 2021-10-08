const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user2" },
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "user2" }],
});

module.exports = mongoose.model("project", projectSchema);
