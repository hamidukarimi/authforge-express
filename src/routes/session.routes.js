import express from "express";
import * as sessionController from "../controllers/session.controller.js";

const router = express.Router();

router.post("/", sessionController.create);

export default router;
