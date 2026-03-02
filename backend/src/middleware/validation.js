const Joi = require('joi');

// ===================== AUTH =====================
const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match'
  }),
  // role is assigned server-side for normal registration; optional for admin-created users
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Customer').optional(),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(), // Can be email or phone
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const forgotPasswordSchema = Joi.object({
  identifier: Joi.string().required(), // Can be email or phone
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords must match'
  }),
});

// ===================== USERS =====================
const userSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().optional().allow(''),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Customer').required(),
});

// Update schema: all fields optional but require at least one
const userUpdateSchema = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  username: Joi.string().optional().allow(''),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('SuperAdmin', 'Admin', 'Customer').optional(),
}).min(1);

// ===================== STOCK =====================
const stockSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
  thickness: Joi.string().optional(),
  laminated: Joi.boolean(),
  origin: Joi.string().valid('Local', 'Imported').required(),
  typeNote: Joi.string().optional(),
  categoryId: Joi.number().integer().optional(),
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
  categoryId: Joi.number().integer().optional().allow(null),
}).min(1);

// ===================== PRODUCTION =====================
const productionSchema = Joi.object({
  categoryId: Joi.number().integer().required(),
  title: Joi.string().optional(),
  status: Joi.string().valid('UnderProcess', 'Completed', 'Rejected').optional(),
  progressPercentage: Joi.number().integer().min(0).max(100).required(),
  startedDate: Joi.date().optional(),
  submittingDate: Joi.date().optional(),
  workInstructions: Joi.string().optional().allow(''),
  paymentNote: Joi.string().optional().allow(''),
});

// Update schema: all fields optional but require at least one
const productionUpdateSchema = Joi.object({
  categoryId: Joi.number().integer().optional(),
  title: Joi.string().optional(),
  status: Joi.string().valid('UnderProcess', 'Completed', 'Rejected').optional(),
  progressPercentage: Joi.number().integer().min(0).max(100).optional(),
  startedDate: Joi.date().optional(),
  submittingDate: Joi.date().optional(),
  workInstructions: Joi.string().optional().allow(''),
  paymentNote: Joi.string().optional().allow(''),
}).min(1);

// ===================== FINISHED PRODUCTS =====================
const finishedProductSchema = Joi.object({
  name: Joi.string().required(),
  categoryId: Joi.number().integer().required(),
  color: Joi.string().required(),
  stockQuantity: Joi.number().integer().min(0).required(),
  price: Joi.number().positive().optional(),
  description: Joi.string().optional(),
  featured: Joi.boolean().optional(),
});

// Update schema: all fields optional but require at least one
const finishedProductUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  categoryId: Joi.number().integer().optional(),
  color: Joi.string().optional(),
  stockQuantity: Joi.number().integer().min(0).optional(),
  price: Joi.number().positive().optional(),
  description: Joi.string().optional(),
  featured: Joi.boolean().optional(),
}).min(1);

// ===================== ORDERS =====================
const orderSchema = Joi.object({
  productId: Joi.number().integer().optional(),
  productName: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  deliveryAddressId: Joi.number().integer().optional(),
  customNotes: Joi.string().optional().allow(''),
  totalPrice: Joi.number().positive().optional(),
  status: Joi.string().valid('OrderSubmitted', 'PaymentConfirmed', 'UnderProcess', 'Completed', 'Cancelled').optional(),
});

const orderUpdateSchema = Joi.object({
  status: Joi.string().valid('PaymentConfirmed', 'Cancelled').required(),
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
  userId: Joi.number().integer().optional().allow(null),
  isCompleted: Joi.boolean().optional(),
});

const todoUpdateSchema = Joi.object({
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').optional(),
  task: Joi.string().optional(),
  userId: Joi.number().integer().optional().allow(null),
  isCompleted: Joi.boolean().optional(),
}).min(1);

// ===================== NEWS =====================
const newsSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  publishDate: Joi.date().optional(),
  authorId: Joi.number().integer().optional(),
});

// ===================== ADDRESSES =====================
const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().optional().allow(''),
  country: Joi.string().optional().allow(''),
  zipCode: Joi.string().optional().allow(''),
  isDefault: Joi.boolean().optional(),
});

const addressUpdateSchema = Joi.object({
  street: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional().allow(''),
  country: Joi.string().optional().allow(''),
  zipCode: Joi.string().optional().allow(''),
  isDefault: Joi.boolean().optional(),
}).min(1);


const newsUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  publishDate: Joi.date().optional(),
  authorId: Joi.number().integer().optional(),
}).min(1);

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
  validateForgotPassword: validate(forgotPasswordSchema),
  validateResetPassword: validate(resetPasswordSchema),
  validateUser: validate(userSchema),
  validateUserUpdate: validate(userUpdateSchema),
  validateStock: validate(stockSchema),
  validateStockUpdate: validate(stockUpdateSchema),
  validateProduction: validateMultipart(productionSchema),
  validateProductionUpdate: validateMultipart(productionUpdateSchema),
  validateFinishedProduct: validate(finishedProductSchema),
  validateFinishedProductUpdate: validate(finishedProductUpdateSchema),
  validateOrder: validate(orderSchema),
  validateOrderUpdate: validate(orderUpdateSchema),
  validatePayment: validate(paymentSchema),
  validateTodo: validate(todoSchema),
  validateTodoUpdate: validate(todoUpdateSchema),
  validateNews: validateMultipart(newsSchema),
  validateNewsUpdate: validateMultipart(newsUpdateSchema),
  validateAddress: validate(addressSchema),
  validateAddressUpdate: validate(addressUpdateSchema),
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
