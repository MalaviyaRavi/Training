var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
const _handlebars = require("handlebars");

let {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const flash = require("connect-flash");

var indexRouter = require("./routes/index");

var app = express();

async function connectDb() {
  try {
    await mongoose.connect("mongodb://ecom:ecom@localhost:27017/ecom");
    //await mongoose.connect("mongodb://localhost:27017/ecom2");
    console.log("database connected");
  } catch (error) {
    console.log("Database Connection Error");
  }
}

connectDb();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: false,
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    partialsDir: __dirname + "/views/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret",
    store: MongoStore.create({
      mongoUrl: "mongodb://ecom:ecom@localhost:27017/ecom",
    }),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require("./passport");

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
