const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    address: String,
    gender: String,
    hobbies: [String],
    interest: String,
    image: { type: String, default: "default.png" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  firstname: "text",
  lastname: "text",
  gender: "text",
  address: "text",
});

module.exports = mongoose.model("user", userSchema);
