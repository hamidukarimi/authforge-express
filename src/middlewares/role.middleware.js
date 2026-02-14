// src/middlewares/role.middleware.js
import ApiError from "../utils/ApiError.js";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "No user attached to request.");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action.",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;
