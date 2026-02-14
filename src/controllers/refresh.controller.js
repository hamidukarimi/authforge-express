

import { handleRefreshToken } from "../services/refresh.service.js";
import env from "../config/env.js";

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const result = await handleRefreshToken(oldRefreshToken, req);

    // 🍪 Set new refresh token in HttpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ❗ Only send new access token in response body
    res.status(200).json({
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
};
