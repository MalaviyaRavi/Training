const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "product name is required"],
  },
  productDetails: {
    type: String,
    required: [true, "product Details is required"],
    minlength: [30, "product Details should be atleast 30 characters long"],
    maxlength: [50, "product Details should be maximum 50 characters long"],
  },

  stockQuantity: {
    type: Number,
    required: [true, "stock Quantity is required"],
  },

  productPrice: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, "product price is required"],
  },

  productDiscount: {
    type: Number,
    default: 0,
  },

  _productSubcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
    },
  ],

  _productCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  ],

  productImages: [String],

  _productReviews: [{ type: mongoose.Types.Schema.ObjectId, ref: "reviews" }],
});
