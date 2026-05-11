import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/images", imageRoutes);

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});