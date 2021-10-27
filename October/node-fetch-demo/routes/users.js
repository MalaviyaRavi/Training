var express = require("express");
var router = express.Router();
const Person = require("../models/person");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  let persons = await Person.find().lean();
  res.json({ persons });
});

module.exports = router;
