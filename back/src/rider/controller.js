const mongoose = require('mongoose');
const { Rider } = require('./model.js');
const utils = require('./utils.js');

// const _ = require('lodash');

mongoose.Promise = Promise;

function completeRide(payload) {
  return Rider.findOne({ riderId: payload.rider_id })
    .catch(err => console.warn(`Rider ${payload.rider_id} not found: ${err}`))
    .then(rider => utils.completeRide(payload, rider))
    .then(rider => rider.save(), err => console.warn(err.message));
}

function createRide(payload) {
  return Rider.findOne({ riderId: payload.rider_id })
    .catch(err => console.warn(`Rider ${payload.rider_id} not found: ${err}`))
    .then(rider => utils.createRide(payload, rider))
    .then(rider => rider.save(), err => console.warn(err.message));
}

function updatePhone({ id, phone_number }) {
  return Rider.update({ riderId: id }, { $set: { phoneNumber: phone_number } });
}

function signup(payload) {
  Rider.create({
    name: payload.name,
    riderId: payload.id,
    loyaltyPoint: 0,
    phoneNumber: '',
    rides: []
  });
}

module.exports = {
  completeRide,
  createRide,
  signup,
  updatePhone
};
