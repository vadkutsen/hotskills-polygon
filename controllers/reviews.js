import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
    try {
        const { user, rating, comment } = req.body;
        const newReview = new Review({
            user,
            rating,
            comment,
            author: req.userId,
        });
        await newReview.save();
        try {
            await User.findByIdAndUpdate(user, {
                $push: { reviews: newReview._id},
            });
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};