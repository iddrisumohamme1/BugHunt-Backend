const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT.js');
const { Userdata } = require('../controllers/userdata.controller.js');


router.get("/", authenticateJWT, Userdata);


module.exports = router;