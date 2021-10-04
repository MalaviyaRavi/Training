const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
  gender: String,
  address: String,
  dob: String,
  profile: { type: String, default: "defaultProfile.png" },
  mnumber: String,

  cart: {
    items: [
      {
        product_id: { type: mongoose.Types.ObjectId, ref: "product" },
        product_qty: { type: Number, default: 1 },
      },
    ],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
