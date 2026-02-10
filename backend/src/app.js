const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../middleware/logger'); 
const errorHandler = require('../middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging (Morgan)

app.use(logger);

// Routes
 app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
