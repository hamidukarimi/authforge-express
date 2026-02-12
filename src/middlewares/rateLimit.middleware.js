import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per window
  message: {
    success: false,
    message: "Too many login attempts. Try again in 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
