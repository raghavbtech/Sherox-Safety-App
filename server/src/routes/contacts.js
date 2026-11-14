const express = require('express');
const mongoose = require('mongoose');
const { z } = require('zod');
const TrustedContact = require('../models/TrustedContact');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation schema for adding a contact
const contactSchema = z.object({
  name: z.string().trim().min(1, 'Contact name required').optional(),
  contact_name: z.string().trim().min(1, 'Contact name required').optional(),
  number: z.string().regex(/^\d{10}$/, 'Invalid phone number: must be 10 digits').optional(),
  contact_number: z.string().regex(/^\d{10}$/, 'Invalid phone number: must be 10 digits').optional(),
}).refine(
  (data) => (data.name || data.contact_name) && (data.number || data.contact_number),
  { message: 'Both contact name and 10-digit number are required' }
);

// GET /api/contacts - list user's contacts
router.get('/contacts', auth, async (req, res, next) => {
  try {
    const contacts = await TrustedContact.find({ user: req.user.id });
    const data = contacts.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      number: c.number,
    }));
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/contacts - add contact (max 5)
router.post('/contacts', auth, validate(contactSchema), async (req, res, next) => {
  try {
    const name = (req.body.contact_name || req.body.name).trim();
    const number = (req.body.contact_number || req.body.number).trim();

    const existingCount = await TrustedContact.countDocuments({ user: req.user.id });
    if (existingCount >= 5) {
      return res.status(400).json({ error: 'Max 5 trusted contacts allowed', message: 'Max 5 trusted contacts allowed' });
    }

    const contact = await TrustedContact.create({
      user: req.user.id,
      name,
      number,
    });

    return res.status(201).json({
      message: 'Contact added',
      contact: {
        id: contact._id.toString(),
        name: contact.name,
        number: contact.number,
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/contacts/:id - delete contact (owner only, 404 for others)
router.delete('/contacts/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const contact = await TrustedContact.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    return res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
});

// GET /api/trusted-contacts/count
router.get('/trusted-contacts/count', auth, async (req, res, next) => {
  try {
    const count = await TrustedContact.countDocuments({ user: req.user.id });
    return res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
});

// GET /api/safety-circle (backward compatibility alias)
router.get('/safety-circle', auth, async (req, res, next) => {
  try {
    const contacts = await TrustedContact.find({ user: req.user.id });
    return res.status(200).json(contacts.map((c) => c.number));
  } catch (err) {
    next(err);
  }
});

// POST /api/safety-circle (backward compatibility alias)
router.post('/safety-circle', auth, async (req, res, next) => {
  try {
    const number = req.body.contact || req.body.number;
    if (!number || !/^\d{10}$/.test(number)) {
      return res.status(400).json({ message: 'Invalid 10-digit phone number' });
    }

    const existingCount = await TrustedContact.countDocuments({ user: req.user.id });
    if (existingCount >= 5) {
      return res.status(400).json({ message: 'Max 5 trusted contacts allowed' });
    }

    await TrustedContact.create({
      user: req.user.id,
      name: req.body.name || 'Emergency Contact',
      number,
    });

    return res.status(200).json({ message: 'Contact added' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
