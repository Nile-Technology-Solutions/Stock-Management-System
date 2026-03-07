const fs = require('fs');
const { errorResponse } = require('../utils/errorResponse');

function cleanupUploadedFiles(req) {
  const files = [];

  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);
  if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
    Object.values(req.files).forEach((entry) => {
      if (Array.isArray(entry)) files.push(...entry);
    });
  }

  for (const file of files) {
    if (!file || !file.path) continue;
    try {
      fs.unlinkSync(file.path);
    } catch (cleanupError) {
      // No-op: failing cleanup must not hide the original request error.
    }
  }
}

function errorHandler(err, req, res, next) {
  cleanupUploadedFiles(req);

  const isMulterError = err && err.name === 'MulterError';
  // Default values
  const statusCode = err.statusCode || (isMulterError ? 400 : 500);
  const message = err.message || (isMulterError ? 'File upload validation failed' : 'Internal Server Error');
  const details = err.details || (isMulterError ? [err.message] : []);

  // Build standardized response
  const response = errorResponse(statusCode, message, details);

  // Add path info
  response.path = req.originalUrl;

  // Send JSON
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
