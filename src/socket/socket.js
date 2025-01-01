const express = require("express");
const http = require("http");
const { join } = require("path");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("userOnline", (user_id) => {
    // If the user doesn't exist in onlineUsers, initialize an empty array
    if (!onlineUsers[user_id]) {
      onlineUsers[user_id] = [];
    }

    // If the socket ID is not already in the user's list, add it
    if (!onlineUsers[user_id].includes(socket.id)) {
      onlineUsers[user_id].push(socket.id);
    }

    // Join the room for the user
    socket.join(user_id);
  });

  socket.on("userOffline", (user_id) => {
    // Check if the user exists in onlineUsers
    if (onlineUsers[user_id]) {
      // Remove the socket ID from the user's list
      onlineUsers[user_id] = onlineUsers[user_id].filter(
        (id) => id !== socket.id
      );

      // If there are no more socket IDs for that user, remove the user entry
      if (onlineUsers[user_id].length === 0) {
        delete onlineUsers[user_id];
      }
    }
    // Log the updated onlineUsers

    // Leave the room for the user
    socket.leave(user_id);
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

module.exports = { io, server, app };
