const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = Schema({
  title: String,
  description: String,
  user_id: mongoose.Types.ObjectId,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
