const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');

// POST /api/upload - Upload images
router.post('/', authMiddleware, requireRoles(ADMIN_ROLES), upload.array('images', 5), (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Return array of file URLs from Cloudinary
        const fileUrls = req.files.map(file => file.path);

        return res.status(200).json({
            message: 'Images uploaded successfully',
            urls: fileUrls
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
