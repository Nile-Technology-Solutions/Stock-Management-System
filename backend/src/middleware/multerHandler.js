const multer = require('multer');

/**
 * Wrap Multer middleware so upload errors are returned as clean 400 responses.
 */
function runMulter(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        return next({
          statusCode: 400,
          message: 'File upload validation failed',
          details: [err.message],
        });
      }

      return next({
        statusCode: 400,
        message: err.message || 'Invalid file upload payload',
        details: [],
      });
    });
  };
}

module.exports = { runMulter };
