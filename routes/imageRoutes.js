import express from "express";

import {
  upload,
  uploadImage,
  getAllImages,
  getSingleImage,
  downloadImage,
  deleteImage,
} from "../controllers/imageController.js";

const router = express.Router();

// Upload
router.post("/upload", upload.single("image"), uploadImage);

// Get All
router.get("/", getAllImages);

// Get Single
router.get("/:id", getSingleImage);

// Download Count Increase
router.get("/download/:id", downloadImage);

// Delete
router.delete("/:id", deleteImage);

export default router;