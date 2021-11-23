const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
// const helpers = require("handlebars-helpers");
const Handlebars = require("handlebars");
const moment = require("moment");

process.env.TZ = "UTC";

let helpers = require("handlebars-helpers")({
  Handlebars: Handlebars,
});

Handlebars.registerHelper("convertUTCtoIST", function (UTCtime) {
  return moment(UTCtime).utcOffset("+05:30").format("YYYY-MM-DD HH:mm a");
});

//api
const userApiRouter = require("./routes/api/users");

const indexRouter = require("./routes/index");

let result = require("dotenv").config();

process.env = result.parsed;

//environment variables
let PORT = 3000;
// let DB_URL = "mongodb://admin:admin@local-mongo-420:27017/ajaxcrud";
let DB_URL = "mongodb://admin:admin@localhost:27017/ajaxcrud";

const app = express();

//database connection
async function databaseConnection(URL) {
  try {
    await mongoose.connect(URL);
    console.log("project database connected");

    app.listen(PORT, function () {
      console.log("project runnig on " + PORT);
      require("./services/cron-jobs/emailService");
    });
  } catch (error) {
    console.log(error);
    console.log("database connection failed");
  }
}

databaseConnection(DB_URL);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: helpers,
    handlebars: Handlebars,
  })
);
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//index router
app.use("/", indexRouter);

//api
app.use("/api/users", userApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.listen(PORT, function () {
//   console.log("app started");
// });

// module.exports = app;
