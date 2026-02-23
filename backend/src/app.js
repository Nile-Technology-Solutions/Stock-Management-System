const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const productionRoutes = require('./routes/productionRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const todoRoutes = require('./routes/todoRoutes');
const newsRoutes = require('./routes/newsRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
// Routes
// Auth routes (public)
app.use('/api/auth', authRoutes);
// Admin routes (protected - mount additional routes here)
app.use('/api/stock', stockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/reports', reportRoutes);

app.use(logger);
app.use(errorHandler);

module.exports = app;
