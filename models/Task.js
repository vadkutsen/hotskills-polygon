const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    reward: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = Task = mongoose.model("task", TaskSchema);