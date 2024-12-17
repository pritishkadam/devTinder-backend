const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['interested', 'ignored', 'accepted', 'rejected'],
        message: `{VALUE} is not a valid status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre('save', function (next) {
  const connectionRequest = this;
  //   check if the sender is not sending connection request to self
  if (connectionRequest.sender.equals(connectionRequest.receiver)) {
    throw new Error('Cannot send connection request to yourself!');
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
