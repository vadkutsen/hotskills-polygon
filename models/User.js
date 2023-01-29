const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        }
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        }
    ],
},
{ timestamps: true },
);

module.exports = User = mongoose.model("user", UserSchema);