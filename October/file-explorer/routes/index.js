const express = require("express");
const router = express.Router();

const fs = require("fs");

const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/files", function (req, res, next) {
  try {
    res.json({ file: "files" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
