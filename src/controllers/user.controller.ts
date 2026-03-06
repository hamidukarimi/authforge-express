import type { RequestHandler } from "express";
import type { StringValue } from "ms";
import { createUser, changePassword } from "../services/user.service.js";
import env from "../config/env.js";
import ms from "ms";

// ─── Controllers ──────────────────────────────────────────────────────────────

export const create: RequestHandler = async (req, res, next) => {
  try {
    const result = await createUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: ms(env.jwtRefreshExpiresIn as StringValue),
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("No user attached to request.");
    }

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    const result = await changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};