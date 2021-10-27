const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
let result = require("dotenv").config();
process.env = result.parsed;
//environment variables
let PORT = parseInt(process.env.PORT);
let DB_URL = process.env.DB_URL;

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const userApiRouter = require("./routes/api/user");

const app = express();

async function databaseConnection(URL) {
  try {
    await mongoose.connect(URL);
    console.log("project database connected");

    app.listen(PORT, function () {
      console.log("project runnig on " + PORT);
    });
  } catch (error) {
    console.log(error);
    console.log("database connection failed");
  }
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
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
      mongoUrl: DB_URL,
    }),
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require("./middlewares/passport-signup");
require("./middlewares/passport-login");
//api router

app.use("/api/users", userApiRouter);

app.use("/", indexRouter);
app.use("/", userRouter);

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

databaseConnection(DB_URL);
//module.exports = app;
