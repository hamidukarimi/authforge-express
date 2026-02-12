import jwt from "jsonwebtoken";



export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "10s",
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
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      issuer: "your-app",
      audience: "your-users",
    }
  );
};