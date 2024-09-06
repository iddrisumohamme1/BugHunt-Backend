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
const AdminDashboardData = async (req, res) => {
    try {
        // Verify that the user is an admin
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Get total reported bugs
        const totalReportedBugs = await Bug.countDocuments();

        // Get total solved bugs
        const totalSolvedBugs = await Bug.countDocuments({ status: 'Closed' });

        // Get bugs reported by each user
        const userBugCounts = await Bug.aggregate([
            {
                $group: {
                    _id: '$reporter',
                    reportedCount: { $sum: 1 },
                    solvedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        // Get top 5 reporters
        const topReporters = userBugCounts
            .sort((a, b) => b.reportedCount - a.reportedCount)
            .slice(0, 5);

        const adminData = {
            totalReportedBugs,
            totalSolvedBugs,
            userBugCounts,
            topReporters
        };

        res.json(adminData);
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const UserNamedata = async (req, res) => {
    try {
        console.log('Full req.user object:', req.user);

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userData = {
            userName: req.user.firstname && req.user.lastname 
                ? `${req.user.firstname} ${req.user.lastname}`
                : req.user.email || 'Unknown User'
        };

        console.log('Sending user data:', userData);
        res.json(userData);
    } catch (error) {
        console.error('Error in Userdata route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    Userdata,
    AdminDashboardData,
    UserNamedata
};