import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/admin-dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin! You can see this dashboard.",
      user: req.user
    });
  }
);

export default router;
