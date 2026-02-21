import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

const DUMMY_HASH = await bcrypt.hash("dummy-password", 12);

export const createSession = async (email, password, req) => {
  const user = await User.findOne({ email }).select("+password");

  const passwordHash = user ? user.password : DUMMY_HASH;

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
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  session.setRefreshToken(refreshToken);
  await session.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};
