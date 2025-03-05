const express = require('express');
const userAuth = require('../middleware/auth');
const { Chat } = require('../models/chat');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

router.get('/message/:targetUserId', userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const { _id: userId } = req.user;

    const connectionRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: targetUserId, receiver: userId, status: 'accepted' },
        { sender: userId, receiver: targetUserId, status: 'accepted' },
      ],
    });

    if (connectionRequest && connectionRequest.length === 0 || !connectionRequest) {
      throw new Error(
        'You need to be a connection to communicate with another user'
      );
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: 'messages.sender',
      select: 'firstName lastName',
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json({ error: false, data: chat });
  } catch (e) {
    res.status(400).send({ error: true, errorMessage: e.message });
  }
});

module.exports = router;
