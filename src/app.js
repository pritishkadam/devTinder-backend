require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database.js');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT_NO = process.env.PORT_NO || 7777;

const REACT_APP_URL = process.env.REACT_APP_URL;

app.use(
  cors({
    origin: REACT_APP_URL,
    credentials: true,
  })
);

// express.json() middleware takes in the request body converts it into JS object and places it back in the request object's body
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const userRouter = require('./routes/user.js');

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);

connectDB()
  .then(() => {
    console.log('Connected to MongoDB Cluster Successfully');
    app.listen(PORT_NO, () => {
      console.log(`Server is listening on http://localhost:${PORT_NO}`);
    });
  })
  .catch((err) => console.log('Connection to MongoDB Cluster failed'));
