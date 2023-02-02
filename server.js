import express, { json } from "express";
import { connectDB } from "./config/db.js";
import { resolve } from "path";
import dotenv from "dotenv";
import authRoute from "./routes/api/auth.js"
import tasksRoute from "./routes/api/tasks.js"
import servicesRoute from "./routes/api/services.js"
import profilesRoute from "./routes/api/profiles.js"
import reviewsRoute from "./routes/api/reviews.js"
import cors from "cors";

dotenv.config()

const app = express();

connectDB();

app.use(json({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/tasks", tasksRoute);
app.use("/api/services", servicesRoute);
app.use("/api/profiles", profilesRoute);
app.use("/api/reviews", reviewsRoute);


// app.use("frontend/build/");

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "frontend/build/index.html"));
});

const PORT = process.env.PORT || 5001;

app.use(cors());

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
