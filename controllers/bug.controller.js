const Bug = require('../models/bug.models.js')



const getBugs = async (req, res) => {
    try {
        const bugs = await Bug.find();
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const getBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug.findById(id);
        if (bug) {
            res.status(200).json(bug);
        } else {
            res.status(404).json({ message: 'Bug not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createBug = async (req, res) => {
    console.log(req.body);
    const bug = new Bug({
        description: req.body.description,
        reporter: req.body.reporter,
        assignee: req.body.assignee,
        status: req.body.status
    });

    try {
        const newBug = await bug.save();
        res.status(201).json(newBug);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updateBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug.findByIdAndUpdate(id, req.body, { new: true });

        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        res.status(200).json(bug);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, author } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Bug ID' });
        }

        const bug = await Bug.findById(id);
        if (!bug) {
            return res.status(404).json({ message: 'Bug not found' });
        }

        bug.comments.push({ message, author });
        const updatedBug = await bug.save();

        res.status(200).json(updatedBug);
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
    addComment,
}