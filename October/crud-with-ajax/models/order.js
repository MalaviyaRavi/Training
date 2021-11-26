const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderPlacedAt: {
    type: DAte,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    enum: ["reject", "pending", "accept"],
  },
  _userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  _shippingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shipping",
  },
  _trackingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tracking",
  },
});

const orderDetailsSchema = mongoose.Schema({
  _orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  _productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  productQty: {
    type: Number,
  },
  productPrice: {
    type: Number,
  },
  needSameDayDelivery: {
    type: Boolean,
    default: flase,
  },
});

const shippingSchema = mongoose.Schema({
  _orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  shippingAddres: {
    type: String,
  },
  shippingCountry: {
    type: String,
  },
  shippingState: {
    type: String,
  },
  shippingCity: {
    type: String,
  },
  shippingPincode: {
    type: String,
  },
  shippingType: {
    type: String,
    enum: ["Officetime/worktime", "home"],
  },
  shippingAgenctyDetails: {
    type: mongoose.Schema.Types.Mixed,
  },
  _userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const trackingSchema = mongoose.Schema({
  _orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  orderDateTime: {
    type: Date,
  },
  orderStatus: {
    type: String,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const orderSchema = mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  //price is getting calculate before order place
  _orderedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  deliveryAddress: {
    houseNo: Number,
    area: String,
    _city: {
      type: mongoose.Types.ObjectId,
      ref: "cities",
      required: [true, "city is required"],
    },
    _state: {
      type: mongoose.Types.ObjectId,
      ref: "states",
      required: [true, "state is required"],
    },
    _country: {
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
  needFastDelivery: {
    type: Boolean,
    default: flase,
  },
});
