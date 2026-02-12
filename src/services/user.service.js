import User from "../models/User.model.js";
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
