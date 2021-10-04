const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  category_name: String,
});

module.exports = mongoose.model("category", categorySchema, "categories");
