const express = require('express');
const TrustedContact = require('../models/TrustedContact');
const EmergencyAlert = require('../models/EmergencyAlert');
const auth = require('../middleware/auth');
const { sosLimiter } = require('../middleware/rateLimit');
const { sendSms } = require('../services/smsService');

const router = express.Router();

// POST /api/contacts/send-sos
router.post('/contacts/send-sos', auth, sosLimiter, async (req, res, next) => {
  try {
    const customMessage = req.body.message || '🚨 SOS Alert from SheRox!';
    const plateNumber = req.body.plate_number;

    let message = customMessage;
    if (plateNumber && !message.includes(plateNumber)) {
      message += `\nVehicle: ${plateNumber}`;
    }

    const contacts = await TrustedContact.find({ user: req.user.id });
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: 'No contacts found', message: 'No contacts found' });
    }

    const numbers = contacts.map((c) => c.number).join(',');
    const smsResponse = await sendSms(numbers, message);

    return res.status(200).json({
      status: 'SMS sent',
      details: smsResponse,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/emergency-alert
router.post('/emergency-alert', auth, async (req, res, next) => {
  try {
    const {
      plateNumber = 'N/A',
      safescore = 'N/A',
      source = 'manual',
      location = {},
    } = req.body;

    const lat = location.lat !== undefined ? Number(location.lat) : 0;
    const lng = location.lng !== undefined ? Number(location.lng) : 0;

    const alertRecord = await EmergencyAlert.create({
      user: req.user.id,
      plateNumber,
      source,
      safescore,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    });

    const userIdentifier = req.user.name || req.user.email;
    const msg =
      `🚨 Emergency Triggered via SheRox!\n` +
      `User: ${userIdentifier}\n` +
      `Plate: ${plateNumber}\n` +
      `Score: ${safescore}\n` +
      `Source: ${source}\n` +
      `Location: ${lat}, ${lng}\n` +
      `https://www.google.com/maps?q=${lat},${lng}`;

    const contacts = await TrustedContact.find({ user: req.user.id });
    let smsDetails = null;
    if (contacts.length > 0) {
      const numbers = contacts.map((c) => c.number).join(',');
      smsDetails = await sendSms(numbers, msg);
    }

    return res.status(200).json({
      status: 'Emergency SMS sent to Safety Circle',
      alertId: alertRecord._id.toString(),
      details: smsDetails,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
