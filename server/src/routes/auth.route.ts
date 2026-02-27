import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.get("/me", authMiddleware, authController.getMeController);
router.post("/logout", authMiddleware, authController.logoutController);
export default router;
