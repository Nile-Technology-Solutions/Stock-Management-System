const router = require('express').Router();
const authController = require('../controllers/authController');
const { 
  validateRegister, 
  validateLogin, 
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword 
} = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/forgot-password
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// GET /api/auth/me
router.get('/me', authMiddleware, authController.me);

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, validateChangePassword, authController.changePassword);

module.exports = router;
