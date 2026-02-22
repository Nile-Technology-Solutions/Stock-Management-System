const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./middleware/logger'); 
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
// Routes
// Auth routes (public)
app.use('/api/auth', authRoutes);
// Admin routes (protected - mount additional routes here)
app.use('/api/stock', stockRoutes);

app.use(logger);
app.use(errorHandler);

module.exports = app;
