var express = require("express");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { getIndex } = require("../controllers/index");
const { isVarified } = require("../middlewares/varify-account");
var router = express.Router();

/* GET home page. */
router.get("/", isAuthenticated, isVarified, getIndex);

module.exports = router;
