import { createSession } from "../services/session.service.js";
import env from "../config/env.js";

export const create = async (req, res, next) => {
  try {
    const { email, password } = req.body;

const result = await createSession(email, password, req);


    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (example)
    });

    res.status(200).json({
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
