const express = require('express');
const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');
const router = express.Router();

router.post('/send/:status/:receiverID', userAuth, async (req, res, next) => {
  try {
    const senderID = req.user._id;
    const receiverID = req.params.receiverID;
    const status = req.params.status;

    // checks
    // 1. sender can't send request to self; handled in schema's pre()
    // 2. check if the status is valid
    const allowedStatuses = ['interested', 'ignored'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`${status} is an invalid status type`);
    }

    // 3. check if toUser exists
    const toUser = await user.findById(receiverID);
    if (!toUser) {
      throw new Error(receiverID + ' is not a valid receiver');
    }

    // 4. check if same sender can't send request to same receiver and receiver can't send request to sender if sender has already sent a request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: senderID, receiver: receiverID },
        { sender: receiverID, receiver: senderID },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error('Connection request already exists!');
    }

    const connectionRequest = new ConnectionRequest({
      sender: senderID,
      receiver: receiverID,
      status: status,
    });

    const data = await connectionRequest.save();

    const senderName = req.user.firstName;
    const receiverName = toUser.firstName;

    const displayMessage =
      status === 'interested'
        ? `${senderName} has sent you a connection request!`
        : `${receiverName} ignored your connection request`;

    res.status(200).json({
      error: false,
      data,
      displayMessage,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      errorMessage: 'Something went wrong due to: ' + error.message,
    });
  }
});

router.post('/review/:status/:requestID', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestID } = req.params;
    const allowedStatuses = ['accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`${status} is an invalid status type`);
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestID,
      status: 'interested',
      receiver: loggedInUser._id,
    });

    if (!connectionRequest) {
      throw new Error('Connection request not found');
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({ error: false, data });
  } catch (error) {
    res.status(400).send({ error: true, errorMessage: error.message });
  }
});

module.exports = router;
