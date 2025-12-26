import Video from "../models/Video.js";
import fs from "fs";
import path from "path";

export const uploadVideo = async (req, res) => {
  try {
    const video = await Video.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedBy: req.user.id,
      status: "processing",
    });

    const io = req.app.get("io");

    // Fake processing delay
    setTimeout(async () => {
      video.status = "completed";
      video.sensitivity = Math.random() > 0.5 ? "safe" : "flagged";
      await video.save();

      io.emit("video-updated", {
        videoId: video._id,
        status: video.status,
        sensitivity: video.sensitivity,
      });
    }, 5000);

    res.status(201).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

export const streamVideo = (req, res) => {
  const videoPath = path.join("uploads", req.params.filename);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
};