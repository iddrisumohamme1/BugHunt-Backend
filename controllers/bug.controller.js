const Bug = require('../models/bug.models.js');
const mongoose = require('mongoose');


const getBugs = async (req, res) => {
    try {
        const email = req.query.email; // Assuming you're filtering by email
        const bugs = await Bug.find({ reporter: email });
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug.findById(id).populate('assignedTo');
        if (bug) {
            res.status(200).json(bug);
        } else {
            res.status(404).json({ message: 'Bug not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBug = async (req, res) => {
    try {
        const { title, description, assignee } = req.body;
        console.log('Request body:', req.body);

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const getRandomName = () => {
            const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Chris Brown', 'Patricia Taylor', 'Robert Wilson', 'Linda Martinez'];
            const randomIndex = Math.floor(Math.random() * names.length);
            return names[randomIndex];
        };

    
        const newBug = new Bug({
            title,
            description,
            reporter: req.user.email,
            assignee: assignee || getRandomName() // Assign random name if not provided
        });

        const savedBug = await newBug.save();
        res.status(201).json(savedBug);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation error', details: error.errors });
        } else {
            console.error('Error creating bug:', error);
            res.status(500).json({ message: 'Server error while creating bug' });
        }
    }
};

const updateBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug.findByIdAndUpdate(id, req.body, { new: true }).populate('assignedTo');

        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        res.status(200).json(bug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug.findByIdAndDelete(id);

        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        res.status(200).json({ message: "Bug deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getBugs,
    getBug,
    createBug,
    updateBug,
    deleteBug,
};
