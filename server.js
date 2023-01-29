import express, { json } from "express";
import { connectDB } from "./config/db.js";
import { resolve } from "path";
import dotenv from "dotenv";
import authRoute from "./routes/api/auth.js"

dotenv.config()

const app = express();

connectDB();

app.use(json({ extended: false }));

app.use("/api/auth", authRoute);
// app.use("/api/tasks", "./routes/api/tasks");
// app.use("/api/services", "./routes/api/services");
// app.use("/api/profiles", "./routes/api/profiles");


// app.use("frontend/build/");

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "frontend/build/index.html"));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
