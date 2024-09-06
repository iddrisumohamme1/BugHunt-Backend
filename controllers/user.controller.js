const bcrypt = require('bcrypt');
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: 'user' // Default role is 'user'
        });

        const newUser = await user.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: newUser._id,
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                role: newUser.role
            },
            token: token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`No user found with email: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`User found: ${user.email}, role: ${user.role}`);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result: ${isMatch}`);

        if (!isMatch) {
            console.log(`Password mismatch for user: ${user.email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                firstname: user.firstname, 
                lastname: user.lastname, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(`Login successful for user: ${user.email}`);

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role
            },
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

const logoutUser = (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid'); // clear the session cookie
        return res.status(200).json({ message: 'Logged out successfully' });
      });
    } else {
      // If there's no session, just send a success response
      return res.status(200).json({ message: 'Logged out successfully' });
    }
};
  
const getLoggedInUsers = async (req, res) => {
    try {
        // Since we don't have a lastLogin field, we'll fetch all users
        // In a real-world scenario, you might want to implement a session system
        const users = await User.find({})
            .select('firstname lastname email role createdAt')
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        console.log('Users:', users); // Log the users being sent

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getLoggedInUsers
};
