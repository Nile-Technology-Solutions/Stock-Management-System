const Joi = require('joi');

// ===================== AUTH =====================
const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Super Admin', 'Admin', 'Customer').required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// ===================== USERS =====================
const userSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  role: Joi.string().valid('Super Admin', 'Admin', 'Customer').required(),
});

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

// ===================== PRODUCTION =====================
const productionSchema = Joi.object({
  category: Joi.string().valid('Bed', 'Door', 'Table', 'Cabinet', 'Other').required(),
  status: Joi.string().valid('Under Process', 'Completed', 'Rejected').optional(),
  progressPercentage: Joi.number().integer().min(0).max(100).required(),
  startedDate: Joi.date().optional(),
  submittingDate: Joi.date().optional(),
  workInstructions: Joi.string().optional(),
  paymentNote: Joi.string().optional(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
});

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
  status: Joi.string().valid('Order Submitted', 'Payment Confirmed', 'Under Process', 'Completed').optional(),
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

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateUser: validate(userSchema),
  validateStock: validate(stockSchema),
  validateProduction: validate(productionSchema),
  validateFinishedProduct: validate(finishedProductSchema),
  validateOrder: validate(orderSchema),
  validatePayment: validate(paymentSchema),
  validateTodo: validate(todoSchema),
  validateNews: validate(newsSchema),
};
