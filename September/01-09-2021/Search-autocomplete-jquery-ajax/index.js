const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
require("./db");
const cors = require("cors");
const { json } = require("express");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var corsOptions = {
  origin: "http://127.0.0.1:5500",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

app.listen(3000, () => {
  console.log("server running on 3000 port");
});

const User = mongoose.model("User", {
  name: { type: String },
  age: { type: Number },
});

app.get("/users", cors(corsOptions), (req, res, next) => {
  const searchedField = req.query.name;
  User.find({ name: { $regex: searchedField, $options: "$i" } }).then(
    (result) => {
      let data = JSON.stringify(result);

      res.json(data);
    }
  );
});

/*
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

  if (req.method == "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});*/
/*var new_user = new User({
  name: "",
  age: 15,
});

new_user.save(function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
*/
