

import Session from "../models/Session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import crypto from "crypto";

export const handleRefreshToken = async (refreshToken, req) => {
  if (!refreshToken) {
    throw { status: 401, message: "No refresh token" };
  }

  const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const session = await Session.findOne({ refreshTokenHash: hashedToken }).populate("user");

  if (!session) throw { status: 403, message: "Invalid refresh token" };

  if (session.expiresAt < new Date()) {
    await session.deleteOne();
    throw { status: 403, message: "Refresh token expired" };
  }

  const newRefreshToken = generateRefreshToken(session.user);
  session.setRefreshToken(newRefreshToken);
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await session.save();

  const accessToken = generateAccessToken(session.user);

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

export const revokeAllSessions = async (userId) => {
  await Session.deleteMany({ user: userId });
};
