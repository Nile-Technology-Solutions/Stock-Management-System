const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');
const uploadNews = require('../config/multerNews');
const newsController = require('../controllers/newsController');
const { validateNews, validateNewsUpdate, validateIdParam } = require('../middleware/validation');

// ── Public routes (no auth) ──

// GET /api/news/public - Browse published news
router.get('/public', newsController.getPublishedNews);

// GET /api/news/public/:id - View single published post
router.get('/public/:id', validateIdParam, newsController.getPublicNewsById);

// ── Admin routes (auth required) ──
router.use(authMiddleware, roleMiddleware(ADMIN_ROLES));

// GET /api/news - List all news (role-scoped)
router.get('/', newsController.getAllNews);

// GET /api/news/:id - Get single news post (role-scoped)
router.get('/:id', validateIdParam, newsController.getNewsById);

// POST /api/news - Create news post (multipart with photos)
router.post('/', uploadNews.array('photos', 10), validateNews, newsController.createNews);

// PUT /api/news/:id - Update news post (multipart with photos)
router.put('/:id', validateIdParam, uploadNews.array('photos', 10), validateNewsUpdate, newsController.updateNews);

// DELETE /api/news/:id - Delete news post
router.delete('/:id', validateIdParam, newsController.deleteNews);

module.exports = router;
