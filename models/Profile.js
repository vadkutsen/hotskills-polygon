const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    avatar: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
        required: false,
    },
    languages: {
        type: Array,
        required: false,
    },
    rate: {
        type: Number,
        required: false
    },
    availability: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);