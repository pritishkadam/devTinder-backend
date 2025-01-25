const express = require('express');
const {
  validateSignUpData,
  validateLoginCreds,
} = require('../utils/validation');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('./../models/user');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now() + '_' + file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

router.post('/signup', upload.single('photoUrl'), async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      emailID,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;

    const imagePath = req.file.path;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
      age,
      gender,
      photoUrl: imagePath,
      about,
      skills,
    });

    const savedUser = await user.save();
    const token = savedUser.getJWT();

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({
      error: false,
      message: 'User added successfully!',
      data: savedUser,
    });
  } catch (error) {
    res.status(400).send({ error: true, errorMessage: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    // validation of data
    validateLoginCreds(req);

    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error('Invalid Credentials!');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid Credentials!');
    }

    const token = await user.getJWT();

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ error: false, data: user });
  } catch (error) {
    res.status(400).send({ error: true, errorMessage: error.message });
  }
});

router.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.send({ error: false, message: 'Logged out successfully!' });
});

module.exports = router;
