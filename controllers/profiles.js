export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().select("-about");
        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

export const getProfilesByIds = async (req, res) => {
    try {
        const ids = req.body.ids.filter((id) => ObjectId.isValid(id));
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