const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const _handlebars = require("handlebars");
console.log(__dirname + "/.env");

const indexRouter = require("./routes/index");
const userApiRouter = require("./routes/api/users");
const addressApiRouter = require("./routes/api/address");

let result = require("dotenv").config();

process.env = result.parsed;

//environment variables
let PORT = parseInt(process.env.PORT);
let DB_URL = process.env.DB_URL;

// let {
//   allowInsecurePrototypeAccess,
// } = require("@handlebars/allow-prototype-access");

//create app
const app = express();

//database connection
async function databaseConnection(URL) {
  try {
    await mongoose.connect(URL);
    console.log("project database connected");

    app.listen(PORT, function () {
      console.log("project runnig on " + PORT);
    });
  } catch (error) {
    console.log("database connection failed");
  }
}

//routers

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    // handlebars: allowInsecurePrototypeAccess(_handlebars),
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//api router

app.use("/api/users", userApiRouter);
app.use("/api/address", addressApiRouter);

//routers
app.use("/", indexRouter);  

//connect database
databaseConnection(DB_URL);

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
  res.render("error", { layout: "login" });
});

//module.exports = app;
