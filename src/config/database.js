// this file holds logic to connect our app to db

const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://preetkdm2:Movdq5z0kNiJ4rSe@namastenodejs.hmo2p.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamasteNodeJS'
  );
};

module.exports = connectDB;