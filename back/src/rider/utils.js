const { Ride } = require('./model.js');
const _ = require('lodash');

function computeLoyaltyPoint(amountRide, nbRides) {
  if (0 <= nbRides && nbRides < 20) {
    return amountRide;
  } else if (20 <= nbRides && nbRides < 50) {
    return amountRide * 3;
  } else if (50 <= nbRides && nbRides < 100) {
    return amountRide * 5;
  } else if (100 <= nbRides) {
    return amountRide * 10;
  }
  return 0;
}

function completeRide(completeRidePayload, rider) {
  const { id } = completeRidePayload;
  const onGoingRide = rider.rides.find(
    ride => ride.rideId === id && ride.status === 'CREATED'
  );
  if (onGoingRide) {
    onGoingRide.status = 'COMPLETED';
    rider.loyaltyPoint += computeLoyaltyPoint(
      onGoingRide.amount,
      rider.rides.length
    );
    return rider;
  }
  throw Error(`Ride ${id} is already completed or not found`);
}

function createRide({ id, amount }, rider) {
  if (!_.some(rider.rides, ride => ride.rideId === id)) {
    const ride = new Ride({
      rideId: id,
      amount,
      status: 'CREATED'
    });
    rider.rides.push(ride);
    return rider;
  }
  throw Error(`Ride ${id} is already created`);
}

module.exports = {
  completeRide,
  createRide,
  computeLoyaltyPoint
};
