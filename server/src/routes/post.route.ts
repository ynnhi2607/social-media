import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", postController.getAllPostsController);
router.get("/:postId", postController.getPostByIdController);
router.get("/user/:userId", postController.getPostsByUserIdController);
router.post("/", authMiddleware, postController.createPostController);
router.put("/:postId", authMiddleware, postController.updatePostController);
router.delete("/:postId", authMiddleware, postController.deletePostController);

export default router;
