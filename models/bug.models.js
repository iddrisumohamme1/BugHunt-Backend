const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const bugSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    reporter: {
        type: String,
        required: true
    },
    assignee: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema]  // Adding comments as an array of subdocuments
});

module.exports = mongoose.model('Bug', bugSchema);
