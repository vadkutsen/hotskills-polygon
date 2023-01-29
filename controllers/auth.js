
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// register
export const register = async (req, res) => {
    try {
        const { address } = req.body;
        const exists = await User.findOne({ address });
        if (exists) {
            return res.status(400).json({ msg: "User aready exists" });
        }
        const newUser = new User({
            address
        });
        await newUser.save();
        const token = jwt.sign(
            {
                id: newUser._id,
                address: newUser.address
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            newUser,
            message: "Signed up successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

// login
export const login = async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findOne({ address });
        if (!user) {
           user = new User({
                address
            });
            await user.save();
        }
        const token = jwt.sign(
            {
                id: user._id,
                address: user.address
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        res.json({
            token,
            user,
            message: "Signed in successfully"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

// get me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ msg: "User does not exists" });
        }
        const token = jwt.sign(
            {
                id: user._id,
                address: user.address
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
            res.json({
                user,
                token
            });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}