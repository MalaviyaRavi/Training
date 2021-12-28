const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      minlength: [2, "firstname should be atleast 2 characters long"],
      maxlength: [10, "firstname should be maximum 10 characters long"],
      validate: {
        validate: {
          validator: function (value) {
            return "regular express for no special characters".test(value);
          },
          message: (props) =>
            `special characters is not a valid ${props.value}!`,
        },
      },
    },
    lastName: {
      type: String,
      required: [true, "lastname is required"],
      minlength: [2, "lastname should be atleast 2 characters long"],
      maxlength: [10, "lastname should be maximum 10 characters long"],
      validate: {
        validate: {
          validator: function (value) {
            return "regular express for no special characters".test(v);
          },
          message: (props) =>
            `special characters is not a valid ${props.value}!`,
        },
      },
    },
  },
  mobileNumber: {
    type: String,
    required: [true, "mobile number is required"],
    validate: {
      validate: {
        validator: function (value) {
          return "regular express for only digits and start with 9/8/7/6 and length is 10 to 12".test(
            value
          );
        },
        message: (props) => `only digits is valid in mobile number`,
      },
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: {
      validate: {
        validator: function (value) {
          return "regular expression email".test(value);
        },
        message: (props) => `please enter valid email address`,
      },
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    validate: {
      validate: {
        validator: function (value) {
          return "regular expression for password strength & lengthy".test(
            value
          );
        },
        message: (props) =>
          `password should be 8 characters long and should have .......`,
      },
    },
    set: function (value) {
      return encryptPassword(value);
    },
    get: function (value) {
      return decryptPassword(value);
    },
  },
  varificationOtp: {
    type: String,
  },
  isUserVarified: {
    type: Boolean,
    default: "false",
  },
  addresses: {
    permenentAddress: {
      houseNo: Number,
      area: String,
      city: {
        type: mongoose.Types.ObjectId(),
        ref: "cities",
        required: [true, "city is required"],
      },
      state: {
        type: mongoose.Types.ObjectId(),
        ref: "states",
        required: [true, "state is required"],
      },
      country: {
        type: mongoose.Types.ObjectId(),
        ref: "countries",
        required: [true, "country is required"],
      },
    },
    currenAddress: {
      houseNo: Number,
      area: String,
      city: {
        type: mongoose.Types.ObjectId(),
        ref: "cities",
        required: [true, "city is required"],
      },
      state: {
        type: mongoose.Types.ObjectId(),
        ref: "states",
        required: [true, "state is required"],
      },
      country: {
        type: mongoose.Types.ObjectId(),
        ref: "countries",
        required: [true, "country is required"],
      },
    },
  },

  cartItems: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      product_qty: Number,
    },
  ],
});
