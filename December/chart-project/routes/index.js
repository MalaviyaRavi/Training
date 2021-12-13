const express = require("express");
const router = express.Router();

const { index, chart, getPieChart } = require("../controllers/index");

/* GET index page. */
router.get("/", index);

router.get("/chart/:chartBy", chart);

router.get("/pieChart", getPieChart);

module.exports = router;
