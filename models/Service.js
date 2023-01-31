import mongoose, { Schema, model } from "mongoose";

const ServiceSchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    authorAddress: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
},
{ timestamps: true }
);

export default model("service", ServiceSchema);