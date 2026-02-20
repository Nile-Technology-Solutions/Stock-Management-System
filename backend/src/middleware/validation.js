const Joi = require('joi');

// ===================== AUTH =====================
const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  // role is assigned server-side for normal registration; optional for admin-created users
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Customer').optional(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

// ===================== USERS =====================
const userSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Customer').required(),
});

// Update schema: all fields optional but require at least one
const userUpdateSchema = Joi.object({
  fullName: Joi.string().optional(),
  username: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Customer').optional(),
}).min(1);

// ===================== STOCK =====================
const stockSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  color: Joi.string().required(),
  size: Joi.string().required(),
  thickness: Joi.string().required(),
  laminated: Joi.boolean(),
  origin: Joi.string().valid('Local', 'Imported').required(),
  typeNote: Joi.string().optional(),
});

// Update schema: all fields optional but require at least one
const stockUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  quantity: Joi.number().integer().min(0).optional(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
  thickness: Joi.string().optional(),
  laminated: Joi.boolean().optional(),
  origin: Joi.string().valid('Local', 'Imported').optional(),
  typeNote: Joi.string().optional(),
}).min(1);

// ===================== PRODUCTION =====================
const productionSchema = Joi.object({
  category: Joi.string().valid('Bed', 'Door', 'Table', 'Cabinet', 'Other').required(),
  status: Joi.string().valid('UnderProcess', 'Completed', 'Rejected').optional(),
  progressPercentage: Joi.number().integer().min(0).max(100).required(),
  startedDate: Joi.date().optional(),
  submittingDate: Joi.date().optional(),
  workInstructions: Joi.string().optional().allow(''),
  paymentNote: Joi.string().optional().allow(''),
});

// Update schema: all fields optional but require at least one
const productionUpdateSchema = Joi.object({
  category: Joi.string().valid('Bed', 'Door', 'Table', 'Cabinet', 'Other').optional(),
  status: Joi.string().valid('UnderProcess', 'Completed', 'Rejected').optional(),
  progressPercentage: Joi.number().integer().min(0).max(100).optional(),
  startedDate: Joi.date().optional(),
  submittingDate: Joi.date().optional(),
  workInstructions: Joi.string().optional().allow(''),
  paymentNote: Joi.string().optional().allow(''),
}).min(1);

// ===================== FINISHED PRODUCTS =====================
const finishedProductSchema = Joi.object({
  category: Joi.string().valid('Bed', 'Door', 'Table', 'Cabinet', 'Other').required(),
  color: Joi.string().required(),
  amount: Joi.number().integer().min(0).required(),
  price: Joi.number().positive().optional(),
  description: Joi.string().optional(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
});

// ===================== ORDERS =====================
const orderSchema = Joi.object({
  productName: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  clientName: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().optional(),
  status: Joi.string().valid('OrderSubmitted', 'PaymentConfirmed', 'UnderProcess', 'Completed').optional(),
});

// ===================== PAYMENTS =====================
const paymentSchema = Joi.object({
  orderId: Joi.number().integer().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('Chapa', 'Telebirr').required(),
  status: Joi.string().optional(),
  transactionRef: Joi.string().optional(),
});

// ===================== TODO =====================
const todoSchema = Joi.object({
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').required(),
  task: Joi.string().required(),
  isCompleted: Joi.boolean().optional(),
});

// ===================== NEWS =====================
const newsSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().optional(),
  publishDate: Joi.date().optional(),
});

// ===================== Middleware Wrapper =====================
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next({
        statusCode: 400,
        message: 'Validation failed',
        details: error.details.map(d => d.message),
      });
    }
    next();
  };
}

/**
 * Multipart-safe validator for form-data routes (used with Multer).
 * - Strips unknown keys (e.g. file fields that end up in req.body)
 * - Writes coerced values back to req.body (e.g. "25" → 25 for numbers)
 */
function validateMultipart(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });
    if (error) {
      return next({
        statusCode: 400,
        message: 'Validation failed',
        details: error.details.map(d => d.message),
      });
    }
    req.body = value; // write back coerced/stripped values
    next();
  };
}

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateChangePassword: validate(changePasswordSchema),
  validateUser: validate(userSchema),
  validateUserUpdate: validate(userUpdateSchema),
  validateStock: validate(stockSchema),
  validateStockUpdate: validate(stockUpdateSchema),
  validateProduction: validateMultipart(productionSchema),
  validateProductionUpdate: validateMultipart(productionUpdateSchema),
  validateFinishedProduct: validate(finishedProductSchema),
  validateOrder: validate(orderSchema),
  validatePayment: validate(paymentSchema),
  validateTodo: validate(todoSchema),
  validateNews: validate(newsSchema),
};

// ID param validator (exports separated because it validates params not body)
module.exports.validateIdParam = (req, res, next) => {
  const { id } = req.params;
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0 || parsed.toString() !== id.toString()) {
    return next({ statusCode: 400, message: 'Invalid ID parameter', details: [] });
  }
  req.params.id = parsed;
  next();
};
