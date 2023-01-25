const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
var ObjectId = require("mongoose").Types.ObjectId;

const Task = require("../../models/Task");

// @route   GET api/tasks
// @desc    get all tasks
// @access  public
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().select("-about");
        res.json(tasks);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/tasks/
// @desc    get tasks of given ids
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
            const ids = req.body.ids.filter((id) => ObjectId.isValid(id));
            const tasks = await Task.find()
                .select("-about")
                .where("_id")
                .in(ids)
                .exec();
            res.json(tasks);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   GET api/tasks/:id
// @desc    get task by id
// @access  public
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        console.log(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   POST api/tasks/new
// @desc    create new task
// @access  public
router.post(
    "/new",
    [
        check("title", "Title is required").notEmpty(),
        check("author", "Author name is required").notEmpty(),
        check(
            "reward",
            "Reward is required and should be greater then 0"
        ).notEmpty().isFloat({min:0}),
        check("description", "Description required").notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { title, author, reward, description } = req.body;
            const task = new Task({
                title,
                author,
                reward,
                description
            });

            await task.save();
            res.json(task);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
