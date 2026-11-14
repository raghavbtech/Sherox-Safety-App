require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sherox',
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret' : 'sherox-dev-jwt-secret-key-12345'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  fast2smsApiKey: process.env.FAST2SMS_API_KEY || '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
};

// Fail fast in production if critical secrets are missing
if (config.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in production');
  }
}

module.exports = config;
