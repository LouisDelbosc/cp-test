const { Ride } = require('./model.js');
const _ = require('lodash');

function completeRide(completeRidePayload, rider) {
  const { id } = completeRidePayload;
  const onGoingRide = rider.rides.find(ride => ride.rideId === id);
  if (onGoingRide) {
    onGoingRide.status = 'COMPLETED';
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Ride ${id} cannot be completed`);
  }
}
function createRide({ id, amount }, rider) {
  if (!_.some(rider.rides, ride => ride.rideId === id)) {
    const ride = new Ride({
      rideId: id,
      amount,
      status: 'CREATED'
    });
    rider.rides.push(ride);
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Ride ${id} is already created`);
  }
}
function updatePhone(updatePhonePayload, rider) {
  rider.phoneNumber = updatePhonePayload.phone_number;
}

module.exports = {
  completeRide,
  createRide,
  updatePhone
};
