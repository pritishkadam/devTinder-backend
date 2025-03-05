const socket = require('socket.io');
const crypto = require('crypto');
const { Chat } = require('../models/chat');

const generateRoomID = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('_'))
    .digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  let onlineUsers = [];

  io.on('connection', (socket) => {
    // handle events
    socket.on('login', ({ userId }) => {
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }
      io.emit('getUsers', { onlineUsers });
    });

    socket.on('joinChat', ({ userId, targetUserId }) => {
      const roomId = generateRoomID(userId, targetUserId);
      socket.join(roomId);
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }
      io.emit('getUsers', { onlineUsers });
    });

    socket.on(
      'sendMessage',
      async ({ firstName, userId, targetUserId, message }) => {
        try {
          const roomId = generateRoomID(userId, targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            sender: userId,
            text: message,
          });
          await chat.save();
          io.to(roomId).emit('messageReceived', {
            firstName,
            sender: userId,
            receiver: targetUserId,
            message,
          });
        } catch (e) {
          console.error(e);
        }
      }
    );

    socket.on('disconnectSession', ({ userId }) => {
      onlineUsers = onlineUsers.filter((user) => user !== userId);
      io.emit('getUsers', { onlineUsers });
    });
  });
};

module.exports = initializeSocket;
