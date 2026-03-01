const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { SUPER_ADMIN_ROLES } = require('../constans/roles');
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate, validateIdParam } = require('../middleware/validation');

// All user management routes require Super Admin role
router.use(authMiddleware, requireRoles(SUPER_ADMIN_ROLES));

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get a single user by ID
router.get('/:id', validateIdParam, userController.getUserById);

// POST /api/users - Create a new user
router.post('/', validateUser, userController.createUser);

// PUT /api/users/:id - Update a user
router.put('/:id', validateIdParam, validateUserUpdate, userController.updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', validateIdParam, userController.deleteUser);

module.exports = router;
