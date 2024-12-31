const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
  },
});

// const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // socket.on("connected", (user_id) => {
  //   if (!onlineUsers[user_id]) {
  //     onlineUsers[user_id] = socket.id;
  //   } else {
  //     onlineUsers[user_id] = socket.id;
  //   }
  //   console.log("connected", onlineUsers);
  // });

  // Join a chat room
  socket.on("joinChatRoom", (room) => {
    console.log(`User joined room ${room}`);
    socket.join(room);
  });

  // Leave a chat room
  socket.on("leaveChatRoom", (room) => {
    console.log(`User leaved room ${room}`);
    socket.leave(room);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

module.exports = { io, server, app };
