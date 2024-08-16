const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT.js');
const { getBugs, getBug, createBug, updateBug, deleteBug } = require('../controllers/bug.controller.js');

router.get('/', getBugs);
router.get('/:id', getBug);
router.post('/', authenticateJWT,createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

module.exports = router;
