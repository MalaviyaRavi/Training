const mongoose = require("mongoose");

const subcategorySchema = mongoose.Schema({
  subcategoryname: String,
  _category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
});

module.exports = mongoose.model("subcategory", subcategorySchema);
