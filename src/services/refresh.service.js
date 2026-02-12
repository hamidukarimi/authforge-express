// import jwt from "jsonwebtoken";
// import User from "../models/User.model.js";
// import { generateAccessToken } from "../utils/jwt.js";

// /**
//  * Handles refresh token verification and new access token generation
//  */
// export const handleRefreshToken = async (refreshToken) => {
//   if (!refreshToken) {
//     throw { status: 401, message: "No refresh token" };
//   }

//   return new Promise((resolve, reject) => {
//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
//       if (err) return reject({ status: 403, message: "Invalid refresh token" });

//       try {
//         const user = await User.findById(decoded.sub);
//         if (!user) return reject({ status: 404, message: "User not found" });

//         if (user.tokenVersion !== decoded.tokenVersion) {
//           return reject({ status: 403, message: "Refresh token revoked" });
//         }

//         const newAccessToken = generateAccessToken(user);
//         resolve({ accessToken: newAccessToken });
//       } catch (error) {
//         reject({ status: 500, message: "Server error" });
//       }
//     });
//   });
// };









import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import crypto from "crypto";

export const handleRefreshToken = async (refreshToken, req) => {
  if (!refreshToken) {
    throw { status: 401, message: "No refresh token" };
  }

  // Hash token to compare with DB
  const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const session = await Session.findOne({ refreshTokenHash: hashedToken }).populate("user");

  if (!session) throw { status: 403, message: "Invalid refresh token" };

  // Check expiration
  if (session.expiresAt < new Date()) {
    await session.deleteOne();
    throw { status: 403, message: "Refresh token expired" };
  }

  // 🍀 Rotation: generate new refresh token and hash it
  const newRefreshToken = generateRefreshToken(session.user);
  session.setRefreshToken(newRefreshToken);
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // extend expiry
  await session.save();

  // Generate new access token
  const accessToken = generateAccessToken(session.user);

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

// 🍀 Optional: revoke all sessions for reuse detection
export const revokeAllSessions = async (userId) => {
  await Session.deleteMany({ user: userId });
};
