const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile pictures
const profileUploadDir = path.join(__dirname, '..', '..', 'uploads', 'profiles');
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `profile-${uniqueSuffix}${ext}`);
    },
});

const profileFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, png, webp, gif) are allowed'), false);
    }
};

const uploadProfile = multer({
    storage: profileStorage,
    fileFilter: profileFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

// All profile routes require authentication
router.use(authMiddleware);

// GET /api/profile - Get current user profile
router.get('/', profileController.getProfile);

// PUT /api/profile - Update current user profile
router.put('/', profileController.updateProfile);

// POST /api/profile/picture - Upload profile picture
router.post('/picture', uploadProfile.single('profilePicture'), profileController.uploadProfilePicture);

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
