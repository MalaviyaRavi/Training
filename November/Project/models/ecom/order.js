const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  _orderedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  deliveryAddress: {
    houseNo: Number,
    area: String,
    city: {
      type: mongoose.Types.ObjectId,
      ref: "cities",
      required: [true, "city is required"],
    },
    state: {
      type: mongoose.Types.ObjectId,
      ref: "states",
      required: [true, "state is required"],
    },
    country: {
      type: mongoose.Types.ObjectId,
      ref: "countries",
      required: [true, "country is required"],
    },
  },

  orderPaymentMethod: {
    type: String,
    enum: ["payment method types..........................."],
  },

  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
  },

  deliverTime: {
    type: String,
    enum: ["Officetime/worktime", "home"],
  },

  orderTotalPrice: {
    type: mongoose.Schema.Types.Decimal128,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  neddFastDelivery: {
    type: Boolean,
    default: flase,
  },
});
