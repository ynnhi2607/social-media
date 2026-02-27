import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);
router.get("/me", authMiddleware, userController.getMyProfileController);
router.put("/me", authMiddleware, userController.updateMyProfileController);
router.get("/:userId", authMiddleware, userController.getUserByIdController);

export default router;
