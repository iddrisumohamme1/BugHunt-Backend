const Bug = require('../models/bug.models.js');
const mongoose = require('mongoose');
const User = require('../models/user.models');


const Userdata =async (req, res) => {
    try {
        // Assuming `req.user` is populated by a middleware that decodes the JWT
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const reportedBugsCount = await Bug.countDocuments({ reporter: user.email });
        const solvedBugsCount = await Bug.countDocuments({ reporter: user.email, status: 'Closed' });

        const userData = {
            reportedBugsCount,
            solvedBugsCount,
            userName: user.name || user.email, // Assuming the User model has a 'name' field
        };

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    Userdata
};