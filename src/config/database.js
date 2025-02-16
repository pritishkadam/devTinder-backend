// this file holds logic to connect our app to db

const mongoose = require('mongoose');

const connectDB = async () => {
  const DB_URL = process.env.DB_URL;
  await mongoose.connect(DB_URL);
};

module.exports = connectDB;
