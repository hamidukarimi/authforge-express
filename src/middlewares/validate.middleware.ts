import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.issues.map((issue) => issue.message),
      });
      return;
    }

    req.body = result.data;
    next();
  };

export default validate;