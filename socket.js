// .env
require("dotenv").config();

// Declare variable
const express = require("express");
const app = express();
const cors = require("cors");
const momment = require("moment");
const axios = require("axios");

var http = require("http").createServer(app);
var io = require("socket.io")(http);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cors());

// const messages = [];

// Handle Connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", async (roomId) => {
    // socket.leaveAll();
    socket.removeAllListeners("chat message");
    socket.join(roomId);
    // console.log(`User socketId: ${socket.id}`);
    console.log(`${socket.id} joining room id: ${roomId}`);

    let messages = [];
    try {
      const res = await axios.get("http://localhost:2104/message", {
        projectId: roomId,
      });
      messages = await res.data;
      console.log(`room ${roomId} messages: ${messages}`);
      socket.emit("room messages", messages);
    } catch (err) {
      console.log(err);
    }

    socket.on("chat message", (msg) => {
      messages.push(msg);
      console.log(`${msg.content} to ${roomId}`);
      io.to(roomId).emit("server messages", messages);
    });
  });

  socket.on("disconnect", () => {
    console.log("User is disconnect");
  });
});

// Running
const port = process.env.SOCKET_PORT || 5000;
http.listen(port, () => {
  console.log(`Socket running on port ${port}`);
});
