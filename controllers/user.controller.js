const bcrypt = require('bcrypt');
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ type: 'warning', message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ type: 'warning', message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        const newUser = await user.save();
        console.log(newUser);

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            type: 'success', 
            message: 'Registration successful!', 
            user: newUser,
            token: token
        });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'An error occurred during registration' });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login request received with email: ${email}`);

        const user = await User.findOne({ email });
        console.log(`User found: ${user}`);
        if (!user) {
            return res.status(401).json({ type: 'warning', message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password comparison result: ${isMatch}`);
        if (!isMatch) {
            return res.status(401).json({ type: 'warning', message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            
        );console.log('Generated token:', token);

        res.status(200).json({ 
            type: 'success', 
            message: 'Login successful!', 
            user: user,
            token: token
        });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'An error occurred during login' });
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
  


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
