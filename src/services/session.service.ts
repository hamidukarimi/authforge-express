import type { Request } from "express";
import type { Types } from "mongoose";
import type { IUserDocument } from "../models/User.model.js";
import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

// ─── Constants ────────────────────────────────────────────────────────────────

const DUMMY_HASH = await bcrypt.hash("dummy-password", 12);

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateSessionResult {
  user: IUserDocument;
  accessToken: string;
  refreshToken: string;
}

interface RefreshSessionResult {
  accessToken: string;
  refreshToken: string;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export const createSession = async (
  email: string,
  password: string,
  req: Request
): Promise<CreateSessionResult> => {
  const user = await User.findOne({ email }).select("+password");

  const passwordHash = user?.password ?? DUMMY_HASH;

  const isMatch = await bcrypt.compare(password, passwordHash);

  if (!user || !isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const session = new Session({
    user: user._id,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  session.setRefreshToken(refreshToken);
  await session.save();

  return { user, accessToken, refreshToken };
};