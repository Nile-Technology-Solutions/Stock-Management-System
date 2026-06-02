const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');
const upload = require('../config/multer');
const productionController = require('../controllers/productionController');
const { validateProduction, validateProductionUpdate, validateIdParam } = require('../middleware/validation');
const { runMulter } = require('../middleware/multerHandler');

// All production routes require Admin or Super Admin
router.use(authMiddleware, requireRoles(ADMIN_ROLES));

// GET /api/production - Get all production records (supports ?status=&category= filters)
router.get('/', productionController.getAllProduction);

// GET /api/production/:id - Get a single production record
router.get('/:id', validateIdParam, productionController.getProductionById);

// POST /api/production - Create new production record (multipart with photos)
// Multer runs first to parse form-data, then validation runs on req.body
router.post('/', runMulter(upload.array('photos', 10)), validateProduction, productionController.createProduction);

// PUT /api/production/:id - Update production record (multipart with photos)
router.put('/:id', validateIdParam, runMulter(upload.array('photos', 10)), validateProductionUpdate, productionController.updateProduction);

// DELETE /api/production/:id - Delete production record
router.delete('/:id', validateIdParam, productionController.deleteProduction);

module.exports = router;
