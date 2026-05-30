const multer = require('multer');

/**
 * Stock endpoints accept multipart form fields, but no file uploads.
 * This keeps request handling consistent while rejecting unexpected files.
 */
const uploadStock = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 0,
    fields: 30,
    fieldSize: 2 * 1024 * 1024, // 2MB per field
  },
});

module.exports = uploadStock;
