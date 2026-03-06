import type { Types } from "mongoose";
import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import type { IUserDocument } from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResult {
  user: IUserDocument;
  accessToken: string;
  refreshToken: string;
}

interface ChangePasswordResult {
  message: string;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export const createUser = async (
  userData: CreateUserData
): Promise<CreateUserResult> => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const changePassword = async (
  userId: Types.ObjectId,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.tokenVersion += 1;

  await user.save();

  await Session.deleteMany({ user: userId });

  return { message: "Password changed successfully. Please login again." };
};