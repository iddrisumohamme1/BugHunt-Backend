const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT.js');
const { getAdminBugs, getBug, createBug, updateBug, deleteBug } = require('../controllers/bug.controller.js');

router.get('/',getBug);
router.get('/Admin',authenticateJWT,getAdminBugs);
router.post('/', authenticateJWT,createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

module.exports = router;
