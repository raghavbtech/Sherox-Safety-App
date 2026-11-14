const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  plateNumber: {
    type: String,
    default: 'N/A',
  },
  source: {
    type: String,
    default: 'manual',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  safescore: {
    type: mongoose.Schema.Types.Mixed,
    default: 'N/A',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

emergencyAlertSchema.index({ location: '2dsphere' });

emergencyAlertSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
