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
    socket.removeAllListeners("connect project");
    socket.join(roomId);
    console.log(`User socketId: ${socket.id}`);
    console.log(`${socket.id} joining room id: ${roomId}`);

    socket.on("project change", () => {
      console.log(`reset project on ${roomId}`);
      io.to(roomId).emit("reload project");
    });
  });

  socket.on("disconnect", () => {
    console.log("User is disconnect");
  });
});

// Running
const port = process.env.SOCKET_PORT || 8008;
http.listen(port, () => {
  console.log(`Socket running on port ${port}`);
});
