var express = require('express');
var router = express.Router();

const Razorpay = require("razorpay")


// router.post("/order", function (req, res) {
//   res.json({
//     orderId: "123456789asresdgvfrsd"
//   })
// })


/* GET users listing. */
router.post('/createOrder', function (req, res, next) {
  let instance = new Razorpay({
    key_id: 'rzp_test_fBYZBlNGqpVtJ5',
    key_secret: '6C5eL0udri4pOEiujI05R2yp'
  });
  let options = {
    amount: 50000,
    currency: "INR",
    receipt: "order_rcptid_11"
  }
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
    }
    res.json({
      orderId: order.id
    })
  });


});
module.exports = router;