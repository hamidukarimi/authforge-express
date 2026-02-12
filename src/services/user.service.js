import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.js";

export const createUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken
  };
};








export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) throw { status: 404, message: "User not found" };

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw { status: 401, message: "Current password is incorrect" };

  // Update password
  user.password = newPassword;

  // Increment tokenVersion to invalidate old refresh tokens
  user.tokenVersion += 1;

  await user.save();

  // Delete all sessions for this user
  await Session.deleteMany({ user: userId });

  return {
    message: "Password changed successfully. Please login again."
  };
};