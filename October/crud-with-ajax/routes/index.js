const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/index");

/* GET home page. */
router.get("/", signup);

module.exports = router;
