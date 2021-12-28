const mongoose = required("mongoose");

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "category name is required"],
  },
});
