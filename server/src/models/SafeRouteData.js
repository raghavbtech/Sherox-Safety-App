const mongoose = require('mongoose');

const safeRouteDataSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  crimeScore: {
    type: Number,
    default: 0.0,
  },
  lightingScore: {
    type: Number,
    default: 0.0,
  },
});

safeRouteDataSchema.index({ location: '2dsphere' });

safeRouteDataSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('SafeRouteData', safeRouteDataSchema);
