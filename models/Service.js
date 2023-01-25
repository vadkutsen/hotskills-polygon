const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
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
});

module.exports = Service = mongoose.model("service", ServiceSchema);