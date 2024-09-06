const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Create a default admin user if it doesn't exist
userSchema.statics.createDefaultAdmin = async function() {
    try {
        const adminExists = await this.findOne({ role: 'admin' });
        if (!adminExists) {
            const defaultAdmin = new this({
                firstname: 'Admin',
                lastname: '1',
                email: 'admin1@example.com', // Use a valid email format
                password: 'adminpassword123', // Use a secure password
                role: 'admin'
            });
            await defaultAdmin.save();
            console.log('Default admin user created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

const User = mongoose.model('User', userSchema);

// Call this function when your application starts
User.createDefaultAdmin();

module.exports = User;
