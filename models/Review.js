import mongoose, { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
    rating: {
        type: number,
        required: true,
    },
    comment: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
},
{ timestamps: true }
);

export default model("review", ReviewSchema);