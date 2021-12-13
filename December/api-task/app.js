const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");

//Model
const User = require("./models/user");

const usersRouter = require("./routes/users");

//api routers
const usersApiRouter = require("./routes/api/users");

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
async function connectDb() {
  try {
    let connection = await mongoose.connect(
      "mongodb://admin:admin@localhost:27017/api-task-database"
    );

    console.log("database connected");

    //add admin user
    await User.update(
      { name: "Admin", email: "admin@admin.com" },
      {
        name: "Admin",
        email: "admin@admin.com",
        mobile: "1234567890",
        password: bcrypt.hashSync("123456", 8),
      },
      { upsert: true }
    );
  } catch (error) {
    console.log(error);
    console.log("database connection failed");
  }
}

app.use("/api", usersApiRouter);

app.use("/", usersRouter);

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

app.listen(3000, function () {
  console.log("app started");
  connectDb();
});

// module.exports = app;
