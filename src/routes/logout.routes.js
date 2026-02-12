import express from "express";
import * as logoutController from "../controllers/logout.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", logoutController.logout);
router.post("/logoutAll", protect, logoutController.logoutAll);

export default router;
