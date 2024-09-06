const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT.js');
const { Userdata ,AdminDashboardData,UserNamedata} = require('../controllers/userdata.controller.js');


router.get("/", authenticateJWT, Userdata);
router.get("/Admin",authenticateJWT, AdminDashboardData);
router.get("/Name", authenticateJWT, UserNamedata);


module.exports = router;