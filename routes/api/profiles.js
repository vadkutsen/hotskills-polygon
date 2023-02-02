import { Router } from "express";
const router = Router();
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

import Profile from "../../models/Profile.js";

// @route   GET api/profiles
// @desc    get all profiles
// @access  public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().select("-about");
        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/profiles/
// @desc    get profiles of given ids
// @access  public
router.post(
    "/",
    [check("ids", "Given list is empty").notEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const ids = req.body.ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
            const profiles = await Profile.find()
                .select("-about")
                .where("_id")
                .in(ids)
                .exec();
            res.json(profiles);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   GET api/profiles/:id
// @desc    get profile by address
// @access  public
router.get("/:address", async (req, res) => {
    try {
        const address = req.params.address;
        const profile = await Profile.findOne({ address });

        if (!profile) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Profile not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   POST api/profiles/new
// @desc    create new profile
// @access  public
router.post(
    "/new",
    [
        check("username", "Udername is required").notEmpty(),
        check("address", "Address is required").notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { avatar, username, skills, languages, rate, availability, address } = req.body;
            const candidate = await Profile.findOne({ address });
            if (candidate) {
                return res.status(400).json({ msg: "Profile aready exists" });
            }

            const profile = new Profile({
                avatar,
                username,
                skills,
                languages,
                rate,
                availability,
                address
            });

            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   POST api/profiles/:id
// @desc    update existing profile
// @access  public
router.put(
    "/:id",
    [
        check("username", "Udername is required").notEmpty(),
        check("address", "Address is required").notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const profile = await Profile.findById(req.params.id);

            if (!profile) {
                return res.status(404).json({ msg: "Profile not found" });
            }
            const { avatar, username, skills, languages, rate, availability } = req.body;

            profile.avatar = avatar;
            profile.username = username;
            profile.skills = skills;
            profile.languages = languages;
            profile.rate = rate;
            profile.availability = availability;

            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

export default router;
