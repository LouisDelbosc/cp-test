const { Rider, Ride } = require('../../src/rider/model.js');

const RiderFactory = args =>
  new Rider({
    riderId: 1,
    loyaltyPoint: 0,
    phoneNumber: 'phone',
    rides: [],
    ...args
  });

const RideFactory = args =>
  new Ride({
    amount: 0,
    rideId: 10,
    status: 'CREATED',
    created: Date('30/04/2018'),
    ...args
  });

module.exports = { RiderFactory, RideFactory };
