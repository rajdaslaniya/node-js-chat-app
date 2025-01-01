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

const onlineUsers = {};

const getReceiverSocketId = (user_id) => {
  return onlineUsers[user_id];
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("userOnline", (user_id) => {
    if (user_id) onlineUsers[user_id] = socket.id;
    console.log("connected", Object.keys(onlineUsers));
  });

  socket.on("userOffline", (user_id) => {
    delete onlineUsers[user_id];
    console.log("disconnected", Object.keys(onlineUsers));
  });

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

module.exports = { io, server, app, getReceiverSocketId };
