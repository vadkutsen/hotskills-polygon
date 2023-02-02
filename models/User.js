import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    services: [
        {
            type: Schema.Types.ObjectId,
            ref: "Service",
        }
    ],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task",
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
},
{ timestamps: true },
);

export default model("user", UserSchema);