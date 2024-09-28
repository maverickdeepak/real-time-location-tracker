const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);

const io = socketio(server);
io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
  console.log("New connection");
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(8888, function () {
  console.log("Example app listening on port 3000!");
});
