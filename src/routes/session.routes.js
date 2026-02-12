import express from "express";
import * as sessionController from "../controllers/session.controller.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/", loginLimiter, sessionController.create);

export default router;
