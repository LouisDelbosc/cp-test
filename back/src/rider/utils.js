const { Ride } = require('./model.js');
const _ = require('lodash');

function completeRide(completeRidePayload, rider) {
  const { id } = completeRidePayload;
  const onGoingRide = rider.rides.find(
    ride => ride.rideId === id && ride.status === 'CREATED'
  );
  if (onGoingRide) {
    onGoingRide.status = 'COMPLETED';
    return rider;
  }
  throw Error(`Ride ${id} is already completed`);
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
  createRide
};
