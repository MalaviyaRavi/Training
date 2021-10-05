const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  // Replace with your key_id
  key_id: "rzp_test_hvs3c6afqiWlal",

  // Replace with your key_secret
  key_secret: "aai4VMUSIBLfXMTL1T20dxQO",
});

exports.postCreateOrder = function (req, res, next) {
  console.log(req.body.cartItems);
  console.log(req.body.totalAmount);
  let amount = req.body.totalAmount;
  console.log(typeof amount);
  const inputObj = {
    amount: amount,
    currency: "INR",
    receipt: "",
  };
  res.redirect("/user/cart");
};
