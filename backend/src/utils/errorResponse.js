function errorResponse(code, message, details = []) {
  return {
    success: false,
    error: { code, message, details },
    timestamp: new Date().toISOString()
  };
}

module.exports = { errorResponse };
