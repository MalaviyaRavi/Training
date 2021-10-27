var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");

/* GET home page. */
router.get("/", async function (req, res, next) {
  let data = await fetch("http://localhost:3000/users");
  let persons = await data.json();
  res.render("index", { title: "Express", persons: persons.persons });
});

module.exports = router;
