const express = require('express');
const router = express.Router();
const Bug = require('../models/bug.models.js');
const {getBugs,getBug, createBug,updateBug, deleteBug,addComment} = require('../controllers/bug.controller.js')

// GET all bugs
router.get('/', getBugs);

// GET a specific bug
router.get('/:id', getBug);

// POST a new bug
router.post('/',createBug)
//UPDATE a bug
router.put('/:id', updateBug);

// DELETE a bug
router.delete('/:id', deleteBug);
// POST a comment to a bug
router.post('/:id/comments', addComment);


module.exports = router;
