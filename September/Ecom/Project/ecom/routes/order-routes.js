const express = require("express");
const router = express.Router();

const { postCreateOrder } = require("../controllers/order-controller");

router.post("/createOrder", postCreateOrder);

module.exports = router;
