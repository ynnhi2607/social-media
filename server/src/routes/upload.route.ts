import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import * as uploadController from "../controllers/upload.controller.js";

const router = Router();

// Upload single image
router.post(
  "/single",
  authMiddleware,
  upload.single("image"),
  uploadController.uploadSingleImage,
);

// Upload multiple images (max 4)
router.post(
  "/multiple",
  authMiddleware,
  upload.array("images", 4),
  uploadController.uploadMultipleImages,
);

// Delete image
router.delete("/delete", authMiddleware, uploadController.deleteImage);

export default router;
