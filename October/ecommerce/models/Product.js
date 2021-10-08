const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productname: String,
  productdetail: String,
  productprice: Number,
  productimages: [String],
  _subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
  },
});

module.exports = mongoose.model("product", productSchema);
