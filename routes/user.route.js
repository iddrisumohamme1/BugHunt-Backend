const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/user.controller.js');

// Post a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);
// logout a user
router.post('/logout', logoutUser);

module.exports = router;
