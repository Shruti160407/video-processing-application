import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    size: Number,
    status: {
      type: String,
      enum: ["processing", "completed"],
      default: "processing",
    },
    sensitivity: {
      type: String,
      enum: ["safe", "flagged"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
