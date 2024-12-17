const jwt = require('jsonwebtoken');
const User = require('./../models/user');
require('dotenv').config()

const CLIENT_SECRET = process.env.CLIENT_SECRET;

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error('Please login!')
        }
        const decodedObject = await jwt.verify(token, CLIENT_SECRET);
        const {_id} = decodedObject;

        const user = await User.findById(_id);
        if(!user) {
            throw new Error('User not found!');
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(400).send({error: true, errorMessage: error.message});
    }
};

module.exports = userAuth;