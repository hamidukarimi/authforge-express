import { createUser } from "../services/user.service.js";

export const create = async (req, res, next) => {
  try {
    const result = await createUser(req.body);

    // 🍪 Send refresh token in httpOnly cookie
    
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (example)
    });

    // ❗ Remove refresh token from response body
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
