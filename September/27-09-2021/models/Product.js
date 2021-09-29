const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  product_name: String,
  product_detail: String,
  product_price: String,
  product_image: String,
  product_qty: Number,
  product_category: {
    type: Schema.Types.ObjectId,
    ref: "Categorie",
  },
});

module.exports = mongoose.model("Product", productSchema);
