import jwt from "jsonwebtoken";
import env from "../config/env.js";



export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.jwtAccessSecret,
    {
      expiresIn: env.jwtAccessExpiresIn || "5m",
      issuer: "your-app-name",
      audience: "your-app-users",
    },
  );
};



export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenVersion: user.tokenVersion,
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn || "7d",
      issuer: "your-app",
      audience: "your-users",
    }
  );
};