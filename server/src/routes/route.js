const express = require('express');
const auth = require('../middleware/auth');
const { computeRouteSafety } = require('../services/safetyScore');

const router = express.Router();

// POST /api/route/safest
router.post('/route/safest', auth, async (req, res, next) => {
  try {
    const origin = req.body.origin || req.body.source;
    const destination = req.body.destination;

    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Missing source or destination',
        message: 'Missing source or destination',
      });
    }

    const result = await computeRouteSafety(origin, destination);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
