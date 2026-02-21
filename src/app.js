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

app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl

      const allowedOrigins = [env.clientUrl];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use("/api", routes);

// =======================
// Health Check Route
// =======================

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AuthForge Express API is running 🚀",
  });
});


// =======================
// Global Error Handler
// =======================

app.use(errorMiddleware);

export default app;
