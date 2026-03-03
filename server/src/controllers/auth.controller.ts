import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, username, password, fullName } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, username and password are required",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3-20 characters and contain only letters, numbers and underscore",
      });
    }
    const result = await authService.registerUser({
      email,
      username,
      password,
      fullName,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/User name and password are required",
      });
    }
    const result = await authService.loginUser({ emailOrUsername, password });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

export async function getMeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const user = await authService.getUserById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}
export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}
