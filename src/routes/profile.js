const express = require('express');
const router = express.Router();
const userAuth = require('./../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');

router.get('/view', userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.json({ error: false, data: user });
  } catch (error) {
    res.status(400).send({ error: true, errorMessage: error.message });
  }
});

router.patch('/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }
    const loggedInUser = req.user;
    Object.keys(user).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      error: false,
      message: `${loggedInUser.firstName}, your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send({ error: true, errorMessage: error.message });
  }
});

module.exports = router;
