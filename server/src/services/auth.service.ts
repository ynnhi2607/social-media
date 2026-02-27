import { PrismaClient } from "../generated/prisma/client.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient({});
export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    bio: string | null;
    role: string;
    createdAt: Date;
  };
  token: string;
}

export async function registerUser(
  input: RegisterInput,
): Promise<AuthResponse> {
  const { email, username, password, fullName } = input;
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already registered");
    }
    if (existingUser.username === username) {
      throw new Error("Username already taken");
    }
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      fullName: fullName || null,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const { emailOrUsername, password } = input;
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }
  if (user.status !== "active") {
    throw new Error("Account is not active");
  }
  const token = generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      bio: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
