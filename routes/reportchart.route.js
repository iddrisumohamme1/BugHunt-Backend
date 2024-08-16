const express = require('express');
const router = express.Router();
const { reportchart } = require('../controllers/reportchart.controller.js');
const authenticateJWT = require('../middleware/authenticateJWT.js');


router.get('/',reportchart)

module.exports = router;
