const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const indexRouter = require("./routes/index");

//environment variables
let PORT = parseInt(process.env.PORT);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//database connection
(async function connectDb() {
  try {
    await mongoose.connect("mongodb://ravi:ravi@localhost:27017/posts-master");
    console.log("database connected");
  } catch (error) {
    console.log("database connection failed");
  }
})();

//index router
app.use("/", indexRouter);

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

module.exports = app;
