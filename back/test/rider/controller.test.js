const mongoose = require('mongoose');
const { expect } = require('chai');
const { Rider } = require('../../src/rider/model.js');
const { RiderFactory, RideFactory } = require('./factory.js');
const {
  updatePhone,
  createRide,
  completeRide
} = require('../../src/rider/controller.js');

describe('rider.controller', () => {
  // before(done => {
  //   mongoose.connect('mongodb://localhost:27017/testRiderController');
  //   mongoose.connection
  //     .once('open', () => {
  //       done();
  //     })
  //     .on('error', error => {
  //       console.warn('Error', error);
  //     });
  // });

  // beforeEach(done => {
  //   const rider = new Rider({
  //     riderId: 'riderId',
  //     loyaltyPoint: 0,
  //     phoneNumber: 'phone',
  //     rides: []
  //   });
  //   rider.save().then(() => {
  //     done();
  //   });
  // });

  // afterEach(done => {
  //   mongoose.connection.collections.riders.drop(() => {
  //     done();
  //   });
  // });

  // after(done => {
  //   mongoose.disconnect(done);
  // });

  describe('updatePhone()', () => {
    it('it should update phone phone', async () => {
      const updatePhonePayload = {
        id: 1,
        phone_number: `+33612345678`
      };
      const rider = RiderFactory({ riderId: 1, phoneNumber: 'phone' });
      updatePhone(updatePhonePayload, rider);
      expect(rider.phoneNumber).to.equal('+33612345678');
    });
  });

  describe('createRide()', () => {
    it('should add ride to rider', () => {
      const ridePayload = {
        id: 10,
        amount: 10,
        rider_id: 1
      };
      const rider = RiderFactory({ riderId: 1 });
      createRide(ridePayload, rider);
      expect(rider.rides[0]).to.include({
        rideId: 10,
        amount: 10,
        status: 'CREATED'
      });
    });

    it('should not add ride if it already exist', () => {
      const ridePayload = { id: 10, rider_id: 1, amount: 10 };
      const rider = RiderFactory({
        riderId: 1,
        rides: [RideFactory({ rideId: 10 })]
      });
      createRide(ridePayload, rider);
      expect(rider.rides.length).to.equal(1);
    });

    it('should add ride to rider with another ride', () => {
      const ridePayload = {
        id: 10,
        amount: 10,
        rider_id: 1
      };
      const rider = RiderFactory({
        riderId: 1,
        rides: [RideFactory({ rideId: 21, status: 'COMPLETED' })]
      });
      createRide(ridePayload, rider);
      expect(rider.rides[1]).to.include({
        rideId: 10,
        amount: 10,
        status: 'CREATED'
      });
    });
  });

  describe('completeRide()', () => {
    it('should complete ride', () => {
      const ridePayload = {
        id: 10,
        amount: 11,
        rider_id: 1
      };
      const rider = RiderFactory({
        riderid: 1,
        rides: [RideFactory({ rideId: 10, status: 'CREATED' })]
      });
      completeRide(ridePayload, rider);
      expect(rider.rides.length).to.equal(1);
      expect(rider.rides[0]).to.include({
        rideId: 10,
        status: 'COMPLETED'
      });
    });

    it('should do nothing if ride is already completed', () => {
      const ridePayload = {
        id: 10,
        amount: 11,
        rider_id: 1
      };
      const rider = RiderFactory({
        riderid: 1,
        rides: [RideFactory({ rideId: 10, status: 'COMPLETED' })]
      });
      completeRide(ridePayload, rider);
      expect(rider.rides.length).to.equal(1);
    });

    it('should do nothing if no rides', () => {
      const ridePayload = {
        id: 10,
        amount: 11,
        rider_id: 1
      };
      const rider = RiderFactory({ riderid: 1, rides: [] });
      completeRide(ridePayload, rider);
      expect(rider.rides.length).to.equal(0);
    });
  });
});
