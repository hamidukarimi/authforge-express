import { createSession } from "../services/session.service.js";

export const create = async (req, res, next) => {
  try {
    const { email, password } = req.body;

const result = await createSession(email, password, req);


     // 🍪 Send refresh token in httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (example)
    });

    // ❗ Remove refresh token from response body
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });

    

    // res.status(200).json({
    //   success: true,
    //   message: "Session created successfully",
    //   data: result
    // });

    
  } catch (error) {
    next(error);
  }
};
