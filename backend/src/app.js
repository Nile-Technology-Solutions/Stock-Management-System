const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes (public)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Admin routes (protected - mount additional routes here)
const stockRoutes = require('./routes/stockRoutes');
app.use('/api/stock', stockRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
