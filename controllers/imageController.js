import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Image from "../models/Image.js";

// Multer Memory Storage
const storage = multer.memoryStorage();

export const upload = multer({ storage });

// ===============================
// Upload Image
// ===============================
export const uploadImage = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "uploads",
    });

    // Save in DB
    const image = await Image.create({
      title,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

// ===============================
// Get All Images
// ===============================
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      total: images.length,
      data: images,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
    });
  }
};

// ===============================
// Get Single Image
// ===============================
export const getSingleImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

// ===============================
// Download Image Count Increase
// ===============================
export const downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Increase download count
    image.downloads += 1;

    await image.save();

    res.json({
      success: true,
      downloadUrl: image.imageUrl,
      downloads: image.downloads,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
};

// ===============================
// Delete Image
// ===============================
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from DB
    await image.deleteOne();

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};