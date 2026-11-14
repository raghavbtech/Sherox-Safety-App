const mongoose = require('mongoose');

const vehicleScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  plateNumber: {
    type: String,
    trim: true,
    uppercase: true,
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
  safeScore: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

vehicleScanSchema.index({ location: '2dsphere' });

vehicleScanSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('VehicleScan', vehicleScanSchema);
