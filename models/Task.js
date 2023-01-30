import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
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

export default model("task", TaskSchema);