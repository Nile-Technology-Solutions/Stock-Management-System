const { errorResponse } = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || [];

  // Build standardized response
  const response = errorResponse(statusCode, message, details);

  // Add path info
  response.path = req.originalUrl;

  // Send JSON
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
