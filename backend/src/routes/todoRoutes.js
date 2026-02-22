const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ADMIN_ROLES, SUPER_ADMIN_ROLES } = require('../constans/roles');
const todoController = require('../controllers/todoController');
const { validateTodo, validateTodoUpdate, validateIdParam } = require('../middleware/validation');

// All todo routes require Admin or SuperAdmin
router.use(authMiddleware, roleMiddleware(ADMIN_ROLES));

// GET /api/todos - List all todos (supports ?day=&userId=&isCompleted= filters)
router.get('/', todoController.getAllTodos);

// GET /api/todos/:id - Get single todo
router.get('/:id', validateIdParam, todoController.getTodoById);

// PATCH /api/todos/:id/toggle - Toggle completion (Admin own-only, SuperAdmin any)
router.patch('/:id/toggle', validateIdParam, todoController.toggleComplete);

// POST /api/todos - Create todo (SuperAdmin only)
router.post('/', roleMiddleware(SUPER_ADMIN_ROLES), validateTodo, todoController.createTodo);

// PUT /api/todos/:id - Full update (SuperAdmin only)
router.put('/:id', validateIdParam, roleMiddleware(SUPER_ADMIN_ROLES), validateTodoUpdate, todoController.updateTodo);

// DELETE /api/todos/:id - Delete todo (SuperAdmin only)
router.delete('/:id', validateIdParam, roleMiddleware(SUPER_ADMIN_ROLES), todoController.deleteTodo);

module.exports = router;
