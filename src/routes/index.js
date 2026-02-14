import express from "express";

import userRoutes from "./user.routes.js";
import sessionRoutes from "./session.routes.js";
import refreshRoutes from "./refresh.routes.js";
import logoutRoutes from "./logout.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/token", refreshRoutes);
router.use("/logout", logoutRoutes);

export default router;