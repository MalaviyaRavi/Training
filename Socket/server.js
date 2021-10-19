const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var path = require("path");

require("./db");

const PORT = 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

io.on("connection", function (socket) {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});
