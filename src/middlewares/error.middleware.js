// src/middlewares/error.middleware.js
import env from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack:
      env.nodeEnv === "development"
        ? err.stack
        : undefined
  });
};

export default errorMiddleware;
