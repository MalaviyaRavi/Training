const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    product_name: String,
    product_detail: String,
    product_qty: Number,
    product_image: String,
    product_price: Number,
    product_category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema, "products");
