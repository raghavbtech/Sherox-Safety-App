const express = require('express');
const VehicleScan = require('../models/VehicleScan');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/log-scan
router.post('/log-scan', auth, async (req, res, next) => {
  try {
    const {
      plate_number,
      plateNumber,
      location_lat,
      location_lng,
      lat,
      lng,
      safescore,
      safeScore,
    } = req.body;

    const finalPlate = (plate_number || plateNumber || '').toString().trim().toUpperCase();
    const latitude = Number(location_lat ?? lat ?? 0);
    const longitude = Number(location_lng ?? lng ?? 0);
    const finalScore = Number(safescore ?? safeScore ?? 0);

    const scan = await VehicleScan.create({
      user: req.user.id,
      plateNumber: finalPlate,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      safeScore: finalScore,
    });

    return res.status(200).json({
      message: 'Scan logged',
      scanId: scan._id.toString(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
