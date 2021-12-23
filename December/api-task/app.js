const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");

global.config = require("./config/config");
require("./middlewares/isAuthenticated");

const usersRouter = require("./routes/users");

//api routers
const usersApiRouter = require("./routes/api/users");

const app = express();
const http = require('http');
const server = http.Server(app);
const io = require("socket.io")(server);

io.on("connection", function (socket) {
  console.log("socket connected");
  global.socket = socket
})


const {
  createClient
} = require('redis');

(async () => {
  global.subscriber = createClient({
    url: 'redis://localhost:6379/0'
  });

  subscriber.on('error', (err) => console.log('Redis Client Error', err));

  await subscriber.connect();
  console.log("app redis connected");

  await subscriber.subscribe('cronNotification', (payLoad) => {
    let {
      message,
      fileName
    } = JSON.parse(payLoad);
    if (message == "cronStart") {
      socket.emit("cronStart")
    }
    if (message == "fileProcessStart") {
      socket.emit("fileProcessStart", {
        fileName
      })
    }
    if (message == "fileProcessEnd") {
      socket.emit("fileProcessEnd", {
        fileName
      })
    }

    if (message == "statusChange") {
      socket.emit("statusChange");
    }
  });

})();




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
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//database connection
async function connectDb() {
  try {
    await mongoose.connect(
      `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`
    );
    console.log("database connected");
    // app.listen(config.port, async function () {
    //   console.log("app started");
    //   require("./services/generateAdmin");
    // require("./cron-jobs/upload-csv");
    // });
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

connectDb();
module.exports = {
  "app": app,
  "server": server
}