const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const sosRoutes = require('./routes/sos');
const scanRoutes = require('./routes/scans');
const routeRoutes = require('./routes/route');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://sherox-safety-app.vercel.app',
];
if (config.clientOrigin && !allowedOrigins.includes(config.clientOrigin)) {
  allowedOrigins.push(config.clientOrigin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        config.nodeEnv !== 'production' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json());

// Liveness health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', sosRoutes);
app.use('/api', scanRoutes);
app.use('/api', routeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
