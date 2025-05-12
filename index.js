require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', require('./routes/health'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for pathToRegexpError
const handler = (req, res) => {
  res.send('This is a test route for pathToRegexpError');
};

app.get('/pathToRegexpError', handler);

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT} (puerto ${PORT})`);
});

// Log registered routes
console.log('---- RUTAS REGISTRADAS ----');
app._router.stack
  .filter(layer => layer.route)
  .forEach(layer => {
    const methods = Object.keys(layer.route.methods).join(',');
    console.log(methods.padEnd(6), layer.route.path);
  });
console.log('---------------------------');
