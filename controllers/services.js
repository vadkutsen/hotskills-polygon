import Service from "../models/Service.js";
import User from "../models/User.js";

export const createService = async (req, res) => {
    try {
        const { category, images, title, authorAddress, price, description, deliveryTime } = req.body;
        const service = new Service({
            category,
            images,
            title,
            description,
            author: req.userId,
            authorAddress,
            price,
            deliveryTime,
            status: 0
        });

        await service.save();
        await User.findByIdAndUpdate(req.userId, {
            $push: {services: service}
        })
        res.json(service);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

export const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort("-createdAt");
        res.json(services);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

export const getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

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
};