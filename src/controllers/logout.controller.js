import Session from "../models/Session.model.js";
import crypto from "crypto";

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
      await Session.findOneAndDelete({ refreshTokenHash: hashedToken });
      res.clearCookie("refreshToken");
    }
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Session.deleteMany({ user: req.user._id });
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out from all devices" });
  } catch (err) {
    next(err);
  }
};