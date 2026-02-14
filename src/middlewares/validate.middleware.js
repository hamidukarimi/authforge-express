const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // show all errors
    stripUnknown: true // remove fields not in schema
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message)
    });
  }

  req.body = value; // sanitized body
  next();
};

export default validate;
