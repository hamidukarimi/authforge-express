// src/middlewares/role.middleware.js

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      if (!req.user) {
        const error = new Error("No user attached to request.");
        error.statusCode = 401;
        throw error;
      }

      if (!allowedRoles.includes(req.user.role)) {
        const error = new Error(
          "You do not have permission to perform this action."
        );
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;
