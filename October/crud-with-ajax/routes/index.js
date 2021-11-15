const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/index");

/* GET index page. */
router.get("/", signup);

module.exports = router;
