var express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

//routes
const userRoutes = require("./routes/user-route");

//mongoose connection
require("./db/db");

var app = express();

//set ejs view engine
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRoutes);

app.get("/", auth, function (req, res) {
  let isLogin = false;

  if (req.user) {
    isLogin = true;
  }
  res.render("index", {
    isLogin: isLogin,
    page_title: "Instagram",
    active_page: "index",
  });
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log("Server is listening on port 3000");
});
