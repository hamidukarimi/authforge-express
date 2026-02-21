

import { handleRefreshToken } from "../services/refresh.service.js";
import env from "../config/env.js";
import ms from "ms";

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const result = await handleRefreshToken(oldRefreshToken, req);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: ms(env.jwtRefreshExpiresIn)
    });

    res.status(200).json({
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
};
