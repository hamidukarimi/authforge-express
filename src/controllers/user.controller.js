import { createUser } from "../services/user.service.js";
import { changePassword } from "../services/user.service.js";
import env from "../config/env.js";
import ms from "ms";

export const create = async (req, res, next) => {
  try {
    const result = await createUser(req.body);
    
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: ms(env.jwtRefreshExpiresIn)
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });

  } catch (error) {
    next(error);
  }
};





export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const result = await changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};