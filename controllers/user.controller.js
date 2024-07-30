const bcrypt = require('bcrypt');
const User = require('../models/user.models');

const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        const newUser = await user.save();
        console.log(newUser);

        // Set success alert and redirect to dashboard
        req.session.alert = { type: 'success', message: 'Registration successful!' };
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login request received with email: ${email}`);

        // Check if user exists
        const user = await User.findOne({ email });
        console.log(`User found: ${user}`);
        if (!user) {
            return res.render('login', { alert: { type: 'warning', message: 'Invalid email or password' } });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password comparison result: ${isMatch}`);
        if (!isMatch) {
            return res.render('login', { alert: { type: 'warning', message: 'Invalid email or password' } });
        }

        // Set success alert and redirect to dashboard
        req.session.alert = { type: 'success', message: 'Login successful!' };
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};
