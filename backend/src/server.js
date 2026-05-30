require('./config/env');

const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`);
});
