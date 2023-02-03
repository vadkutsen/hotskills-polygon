import mongoose, { Schema, model } from "mongoose";

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    authorAddress: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    reward: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    taskType: {
        type: Number,
        required: true,
    },
    assigneeAddress: {
        type: String,
    },
    dueDate: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    candidates: {
        type: Array,
    },
    result: {
        type: String,
    },
    changeRequests: {
        type: Array,
    },
    status: {
        type: Number,
        required: true,
    },

},
{ timestamps: true }
);

export default model("task", TaskSchema);