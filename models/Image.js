import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;