import { Request, Response, NextFunction } from "express";

export async function getMyProfileController(
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

    // TODO: Implement logic
    return res.status(200).json({
      success: true,
      message: "Get profile - Coming soon",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProfileController(
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
    return res.status(200).json({
      success: true,
      message: "Update profile - Coming soon",
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;
    return res.status(200).json({
      success: true,
      message: "Get user by ID - Coming soon",
    });
  } catch (error) {
    next(error);
  }
}
