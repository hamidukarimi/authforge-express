import express from "express";
import * as userController from "../controllers/user.controller.js";
import { updatePassword } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, changePasswordSchema } from "../validators/user.validator.js";

const router = express.Router();

router.post("/", validate(registerSchema), userController.create);
router.put("/me/password", protect, validate(changePasswordSchema), updatePassword);

export default router;
