const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const { upload } = require('../config/multer');

// All profile routes require authentication
router.use(authMiddleware);

// GET /api/profile - Get current user profile
router.get('/', profileController.getProfile);

// PUT /api/profile - Update current user profile
router.put('/', profileController.updateProfile);

// POST /api/profile/picture - Upload profile picture
router.post('/picture', upload.single('profilePicture'), profileController.uploadProfilePicture);

// GET /api/profile/preferences - Get user preferences
router.get('/preferences', profileController.getPreferences);

// PUT /api/profile/preferences - Update user preferences
router.put('/preferences', profileController.updatePreferences);

// POST /api/profile/feedback - Submit feedback
router.post('/feedback', profileController.submitFeedback);

// POST /api/profile/support - Contact support
router.post('/support', profileController.contactSupport);

// GET /api/profile/notifications - Get notifications
router.get('/notifications', profileController.getNotifications);

// PUT /api/profile/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', profileController.markNotificationRead);

module.exports = router;
