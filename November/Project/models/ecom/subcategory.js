const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
  subCategoryName: {
    type: String,
    required: [true, "subcategory name is required"],
  },
  _category: {
    type: mongoose.Schema.Types.Objectid,
    ref: "categories",
  },
});
