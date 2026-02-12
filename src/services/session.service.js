// import User from "../models/User.model.js";
// import {
//   generateAccessToken,
//   generateRefreshToken
// } from "../utils/jwt.js";

// export const createSession = async (email, password) => {
//   const user = await User.findOne({ email }).select("+password");

//   if (!user) {
//     const error = new Error("Invalid credentials");
//     error.statusCode = 401;
//     throw error;
//   }

//   const isMatch = await user.comparePassword(password);

//   if (!isMatch) {
//     const error = new Error("Invalid credentials");
//     error.statusCode = 401;
//     throw error;
//   }

//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   return {
//     user,
//     accessToken,
//     refreshToken
//   };
// };










import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const createSession = async (email, password, req) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 🍀 Create DB session with hashed refresh token
  const session = new Session({
    user: user._id,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  session.setRefreshToken(refreshToken);
  await session.save();

  return {
    user,
    accessToken,
    refreshToken
  };
};
