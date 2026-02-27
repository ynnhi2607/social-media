import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
export interface JwtPayLoad {
  userId: string;
  email: string;
  username: string;
}

export function generateToken(payLoad: JwtPayLoad): string {
  return jwt.sign(payLoad, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayLoad {
  return jwt.verify(token, config.jwtSecret) as JwtPayLoad;
}
