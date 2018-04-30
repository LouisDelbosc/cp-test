const mongoose = require('mongoose');
const { expect } = require('chai');
const { Rider } = require('../../src/rider/model.js');
const { RiderFactory, RideFactory } = require('./factory.js');
const {
  completeRide,
  createRide,
  updatePhone
} = require('../../src/rider/controller.js');

describe('rider.controller', () => {
  before(done => {
    mongoose.connect('mongodb://localhost:27017/testRiderController');
    mongoose.connection
      .once('open', () => {
        done();
      })
      .on('error', error => {
        console.warn('Error', error);
      });
  });

  beforeEach(done => {
    const rider = new Rider({
      riderId: 1,
      loyaltyPoint: 0,
      phoneNumber: 'phone',
      rides: [
        RideFactory({
          rideId: 10,
          status: 'CREATED',
          amount: 100
        })
      ]
    });
    rider.save().then(() => {
      done();
    });
  });

  afterEach(done => {
    mongoose.connection.collections.riders.drop(() => {
      done();
    });
  });

  after(done => {
    mongoose.disconnect(done);
  });

  describe('updatePhone()', () => {
    it('should update phone and save the rider', async () => {
      await updatePhone({ id: 1, phone_number: 'newPhoneNumber' });
      const rider = await Rider.findOne({ riderId: 1 }).exec();
      expect(rider.phoneNumber).to.equal('newPhoneNumber');
    });
  });

  describe('createRide()', () => {
    it('should create a new ride', async () => {
      await createRide({ id: 1, amount: 10, rider_id: 1 });
      const rider = await Rider.findOne({ riderId: 1 }).exec();
      expect(rider.rides.length).to.equal(2);
    });

    it('should not create an existing ride', async () => {
      await createRide({ id: 10, amount: 10, rider_id: 1 });
      const rider = await Rider.findOne({ riderId: 1 }).exec();
      expect(rider.rides.length).to.equal(1);
    });
  });

  describe('completeRide()', () => {
    it('should complete a created ride', async () => {
      await completeRide({ id: 10, amount: 10, rider_id: 1 });
      const rider = await Rider.findOne({ riderId: 1 }).exec();
      expect(rider.rides[0]).to.include({
        rideId: 10,
        amount: 100,
        status: 'COMPLETED'
      });
    });

    it('should not update when no ride to complete', async () => {
      await completeRide({ id: 11, amount: 10, rider_id: 1 });
      const rider = await Rider.findOne({ riderId: 1 }).exec();
      expect(rider.rides.length).to.equal(1);
    });
  });
});
