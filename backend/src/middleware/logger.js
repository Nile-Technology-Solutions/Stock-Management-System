const morgan = require('morgan');

// Define custom log format
// Example: [2026-02-10T21:25:00Z] POST /api/auth/login 200 - 15ms
const loggerFormat = ':date[iso] :method :url :status - :response-time ms';

const logger = morgan(loggerFormat);

module.exports = logger;
