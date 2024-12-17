const express = require('express');
const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const router = express.Router();

const SAFE_DATA_FIELDS = 'firstName lastName photoUrl age gender about skills';

router.post('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      receiver: loggedInUser._id,
      status: 'interested',
    }).populate('sender', SAFE_DATA_FIELDS);

    res.json({ error: false, data: connectionRequest });
  } catch (error) {
    res.status(400).send({
      error: true,
      errorMessage: 'Something went wrong due to: ' + error.message,
    });
  }
});

router.post('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { receiver: loggedInUser._id, status: 'accepted' },
        { sender: loggedInUser._id, status: 'accepted' },
      ],
    });

    if (connectionRequest && connectionRequest.length === 0) {
      res.json({ error: false, data: [] });
    }

    const data = connectionRequest.map((row) => {
      if (row.sender.toString() === loggedInUser._id.toString()) {
        return row.receiver;
      }
      return row.sender;
    });

    res.json({ error: false, data });
  } catch (error) {
    res.status(400).send({
      error: true,
      errorMessage: 'Something went wrong due to: ' + error.message,
    });
  }
});

router.post('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pageNumber = Number.parseInt(req.query.skip) || 1;
    const limit = Number.parseInt(req.query.skip) || 10;
    const skip = (pageNumber - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }],
    }).select('sender receiver');

    const hideUsersSet = new Set();

    connectionRequest.forEach((request) => {
      hideUsersSet.add(request.sender.toString());
      hideUsersSet.add(request.receiver.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersSet) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_DATA_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({ error: false, data: users });
  } catch (error) {
    res.status(400).send({ error: true, errorMessage: error.message });
  }
});

module.exports = router;