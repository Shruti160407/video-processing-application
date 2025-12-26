import express from "express";
import upload from "../utils/multer.js";
import { protect } from "../middleware/auth.js";
import { uploadVideo, getMyVideos } from "../controllers/videoController.js";
import { streamVideo } from "../controllers/videoController.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

router.get("/", protect, getMyVideos);

router.get("/stream/:filename", protect, streamVideo);

router.post(
  "/upload",
  protect,
  allowRoles("editor", "admin"),
  (req, res, next) => {
    upload.single("video")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadVideo
);

export default router;
