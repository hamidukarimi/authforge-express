import express from "express";
import * as userController from "../controllers/user.controller.js";
import { updatePassword } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", userController.create);
router.put("/me/password", protect, updatePassword);

export default router;
