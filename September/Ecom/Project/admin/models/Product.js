const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    product_name: String,
    product_detail: String,
    product_qty: String,
    product_image: String,
    product_price: String,
    product_category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema, "products");
