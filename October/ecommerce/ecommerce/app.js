var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("express-handlebars");
const session = require("express-session");
const fileupload = require("express-fileupload");
const flash = require("connect-flash");
const { isAuth } = require("./middlewares/admin/auth");

//routes
const adminIndexRouter = require("./routes/admin/index");
const adminProductRouter = require("./routes/admin/product");
const admincategoryRouter = require("./routes/admin/category");
const adminSubcategoryRouter = require("./routes/admin/subcategory");
const adminStateRouter = require("./routes/admin/state");
const adminCityRouter = require("./routes/admin/city");
const adminAreaRouter = require("./routes/admin/area");
const adminUserRouter = require("./routes/admin/user");
const apiRouter = require("./routes/api");

var app = express();

//database connection
require("./services/db");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/admin/layout/",

    partialsDir: __dirname + "/views/admin/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session
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
app.use(flash());
//fileupload
//app.use(fileupload());

app.use(express.static(path.join(__dirname, "public")));

//admin routers
app.use("/admin", adminIndexRouter);

app.use("/api", apiRouter);

app.use("/admin/user", isAuth, adminUserRouter);
app.use("/admin/product", isAuth, adminProductRouter);
app.use("/admin/category", isAuth, admincategoryRouter);
app.use("/admin/subcategory", isAuth, adminSubcategoryRouter);
app.use("/admin/state", isAuth, adminStateRouter);
app.use("/admin/city", isAuth, adminCityRouter);
app.use("/admin/area", isAuth, adminAreaRouter);

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
