const router = require('express').Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validateChangePassword } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// GET /api/auth/me
router.get('/me', authMiddleware, authController.me);

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, validateChangePassword, authController.changePassword);

module.exports = router;
