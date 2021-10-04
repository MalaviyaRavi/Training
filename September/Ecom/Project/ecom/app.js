var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
var paginateHelper = require("express-handlebars-paginate");
const fileupload = require("express-fileupload");
const session = require("express-session");
const indexRouter = require("./routes/index-routes");
const productRouter = require("./routes/product-routes");
const userRouter = require("./routes/user-routes");
const cartRouter = require("./routes/cart-routes");
const orderRouter = require("./routes/order-routes");

var app = express();

require("./db");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);

// app.use(expressSession());
// hbs.handlebars.registerHelper(
//   "paginateHelper",
//   paginateHelper.createPagination
// );

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
app.use(fileupload());

app.use("/", indexRouter);

app.use("/user", userRouter);
app.use("/user/cart", cartRouter);
app.use("/user/order", orderRouter);

app.use("/product", productRouter);

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
