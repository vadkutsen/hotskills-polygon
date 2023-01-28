const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
require('dotenv').config()

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use("/api/tasks", require("./routes/api/tasks"));
app.use("/api/services", require("./routes/api/services"));
app.use("/api/profiles", require("./routes/api/profiles"));


app.use(
    express.static("frontend/build/")
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/build/index.html"));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
