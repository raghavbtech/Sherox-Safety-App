const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

const sosLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Stricter limit for SOS SMS triggering
  message: { message: 'Too many SOS requests. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

module.exports = {
  authLimiter,
  sosLimiter,
  generalLimiter,
};
