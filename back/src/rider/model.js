const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  rideId: { type: Number },
  amount: { type: Number },
  status: { type: String, enum: ['CREATED', 'CANCELED', 'COMPLETED'] },
  created: { type: Date, default: Date.now }
});

const RiderSchema = new mongoose.Schema({
  name: { type: String },
  loyaltyPoint: { type: Number, min: 0 },
  phoneNumber: { type: String },
  riderId: { type: String },
  rides: [RideSchema]
});

module.exports = {
  Rider: mongoose.model('Rider', RiderSchema),
  Ride: mongoose.model('Ride', RideSchema)
};
