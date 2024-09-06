const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser ,getLoggedInUsers} = require('../controllers/user.controller.js');
const authenticateJWT = require('../middleware/authenticateJWT.js');
// Post a new user
router.post('/register', registerUser);

//Get all users
router.get('/loggedUser', authenticateJWT,getLoggedInUsers);

// Login a user
router.post('/login', loginUser);
// logout a user
router.post('/logout', logoutUser);

module.exports = router;
