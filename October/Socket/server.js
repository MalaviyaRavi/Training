const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var path = require("path");
const session = require("express-session");
const User = require("./models/user");
let sessionValue;
let connection_id;
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");

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

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
app.use(express.urlencoded({ urlencoded: false }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    name: "User_Authentication_Key",
    secret: "MR@3795",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 60,
    },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

io.on("connection", async function (socket) {
  console.log("new connection");

  connection_id = socket.id;

  try {
    await User.findByIdAndUpdate(sessionValue, {
      user_socket_id: connection_id,
    });
    socket.broadcast.emit("new_user_online", { sessionValue, connection_id });
  } catch (error) {
    console.log(error);
  }

  socket.on("disconnect", async () => {
    try {
      await User.findByIdAndUpdate(sessionValue, {
        user_socket_id: "",
      });

      io.emit("oneuserleft", sessionValue);

      // usersarray = usersarray.map((userso) => {
      //   return userso != socket;
      // });
      // usersarray = usersarray.filter((usersocket) => {
      //   return usersocket != socket;
      // });

      // usersarray.forEach((usersocket) => {
      //   usersocket.emit("oneuserleft");
      // });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  let { username } = req.body;
  let user = await User.create({ username });
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  let { username } = req.body;
  let user = await User.findOne({ username });
  if (!user) {
    return res.redirect("/signup");
  }
  req.session.userid = user._id;
  sessionValue = user.id;
  res.redirect("/chat");
});

app.get("/chat", async (req, res) => {
  if (!req.session.userid) return res.redirect("/login");

  res.render("index");
});

app.get("/logout", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.session.userid, {
      user_socket_id: "",
    });
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async function (req, res, next) {
  let onlineusers = await User.find({
    user_socket_id: { $ne: "" },
  }).lean();

  onlineusers = onlineusers.filter((user) => {
    return user._id != req.session.userid;
  });

  let offlineusers = await User.find({
    user_socket_id: { $eq: "" },
  }).lean();

  offlineusers = offlineusers.filter((user) => {
    return user._id != req.session.userid;
  });

  res.status(200).json({ onlineusers, offlineusers });
});
