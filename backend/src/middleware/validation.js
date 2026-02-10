const Joi = require('joi');

// --- Auth Schemas ---
const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  username: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Super Admin', 'Admin', 'Customer').required()
});

// --- Middleware Factory ---
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Collect all validation messages
      const details = error.details.map(d => d.message);
      // Pass error to global handler
      return next({
        statusCode: 400,
        message: 'Validation failed',
        details
      });
    }
    next();
  };
}

module.exports = {
  validateLogin: validate(loginSchema),
  validateRegister: validate(registerSchema)
};
