const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const config = require('../config');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/signup
router.post('/signup', authLimiter, validate(signupSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/login
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        user_id: user._id.toString(),
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
