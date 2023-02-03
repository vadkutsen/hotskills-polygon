import Task from "../models/Task.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  try {
    const {
      category,
      title,
      authorAddress,
      reward,
      description,
      dueDate,
      taskType,
      assigneeAddress,
      currency,
    } = req.body;
    const task = new Task({
      category,
      title,
      authorAddress,
      reward,
      description,
      dueDate,
      taskType,
      assigneeAddress,
      currency,
      candidates,
      author: req.userId,
      status: 0,
    });
    await task.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { tasks: task },
    });
    res.json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort("-createdAt");
    res.json(tasks);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).send("Server Error");
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.tasks.map((t) => {
        return Task.findById(t._id);
      })
    );
    res.json(list);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await User.findByIdAndUpdate(req.userId, {
      $pull: { tasks: req.params.id},
    })
    res.json({message: "Task deleted"});
  } catch (error) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(500).send("Server Error");
  }
};

export const updateTask = async (req, res) => {
  try {
    const {
        category,
        title,
        authorAddress,
        reward,
        description,
        dueDate,
        taskType,
        assigneeAddress,
        currency,
        id
    } = req.body;
    const task = await Task.findById(id);
    service.category = category;
    service.title = title;
    service.authorAddress = authorAddress;
    service.description = description;
    service.reward = reward;
    service.dueDate = dueDate;
    service.taskType = taskType;
    service.assigneeAddress = assigneeAddress;
    service.reward = currency;

    await task.save();
    res.json(service);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
