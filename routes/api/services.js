import { Router } from "express";
const router = Router();
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

import Service from "../../models/Service.js";

// @route   GET api/services
// @desc    get all services
// @access  public
router.get("/", async (req, res) => {
    try {
        const services = await find().select("-about");
        res.json(services);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/services/
// @desc    get services of given ids
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
            const services = await find()
                .select("-about")
                .where("_id")
                .in(ids)
                .exec();
            res.json(services);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   GET api/services/:id
// @desc    get service by id
// @access  public
router.get("/:id", async (req, res) => {
    try {
        const service = await findById(req.params.id);

        if (!service) {
            return res.status(404).json({ msg: "Service not found" });
        }

        res.json(service);
    } catch (err) {
        console.log(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Service not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   POST api/services/new
// @desc    create new service
// @access  public
router.post(
    "/new",
    [
        check("category", "Category is required").notEmpty(),
        check("title", "Title is required").notEmpty(),
        check("author", "Author address is required").notEmpty(),
        check(
            "price",
            "Price is required and should be greater then 0"
        ).notEmpty().isFloat({min:0}),
        check("description", "Description required").notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { category, images, title, author, price, description, deliveryTime } = req.body;
            const service = new Service({
                category,
                images,
                title,
                description,
                author,
                price,
                deliveryTime,
                status: 0
            });

            await service.save();
            res.json(service);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

export default router;
