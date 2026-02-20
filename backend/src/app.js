const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const stockRoutes = require('./routes/stockRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount stock routes
app.use('/api/stock', stockRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
