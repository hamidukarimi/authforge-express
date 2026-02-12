import express from "express";
import * as refreshController from "../controllers/refresh.controller.js";

const router = express.Router();

router.post("/", refreshController.refresh);

export default router;
