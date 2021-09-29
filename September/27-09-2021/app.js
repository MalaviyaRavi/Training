var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const exphbs = require("express-handlebars");
const session = require("express-session");
const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
var productRouter = require("./routes/product");

var app = express();
require("./db");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: false,
    extname: ".handlebars",
    partialsDir: [path.join(__dirname, "views/partials")],
  })
);
app.set("view engine", "handlebars");
app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: "User_Authentication_Key",
    secret: "MR@3795",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 7, //7 minutes
      httpOnly: true,
    },
  })
);

app.use(indexRouter);
app.use(usersRouter);
app.use(adminRouter);
app.use(productRouter);

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
