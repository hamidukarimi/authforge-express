// src/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";


import errorMiddleware from "./middlewares/error.middleware.js";
import env from "./config/env.js";

const app = express();

// =======================
// Global Middlewares
// =======================

app.use(helmet()); // Security headers
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev")); // Logging only in dev
}

app.use("/api", routes);

// =======================
// Health Check Route
// =======================

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AuthForge Express API is running 🚀"
  });
});




// =======================
// Routes (we'll add later)
// =======================

// app.use("/api/auth", authRoutes);

// =======================
// Global Error Handler
// =======================

app.use(errorMiddleware);

export default app;
