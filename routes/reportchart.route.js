const express = require('express');
const router = express.Router();
const { reportchart,reportchartAdmin} = require('../controllers/reportchart.controller.js');
const authenticateJWT = require('../middleware/authenticateJWT.js');


router.get('/', authenticateJWT, reportchart)
router.get('/Admin', authenticateJWT, reportchartAdmin)


module.exports = router;
