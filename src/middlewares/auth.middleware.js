// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Not authorized. No token provided.");
    }

    const decoded = jwt.verify(
      token,
      env.jwtAccessSecret
    );

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new ApiError(401, "User no longer exists.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
