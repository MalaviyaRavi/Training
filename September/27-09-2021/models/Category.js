const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categodySchema = new Schema({
  category_name: String,
});

module.exports = mongoose.model("Categorie", categodySchema);
