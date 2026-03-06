import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  changePasswordSchema,
} from "../validators/user.validator.js";

const router = Router();

router.post("/", validate(registerSchema), userController.create);
router.put(
  "/me/password",
  protect,
  validate(changePasswordSchema),
  userController.updatePassword,
);

export default router;