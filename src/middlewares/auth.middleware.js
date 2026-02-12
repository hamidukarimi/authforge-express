// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Not authorized. No token provided.");
      error.statusCode = 401;
      throw error;
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // 3️⃣ Find user
    const user = await User.findById(decoded.sub);

    if (!user) {
      const error = new Error("User no longer exists.");
      error.statusCode = 401;
      throw error;
    }

    // 4️⃣ Check if account is active
    if (!user.isActive) {
      const error = new Error("Account is deactivated.");
      error.statusCode = 403;
      throw error;
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

export default protect;
