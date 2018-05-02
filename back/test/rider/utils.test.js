const mongoose = require('mongoose');
const { expect } = require('chai');
const { RiderFactory, RideFactory } = require('./factory.js');
const {
  createRide,
  completeRide,
  computeLoyaltyPoint
} = require('../../src/rider/utils.js');

describe('rider.utils', () => {
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
      expect(() => createRide(ridePayload, rider)).to.throw();
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
      expect(() => completeRide(ridePayload, rider)).to.throw();
      expect(rider.rides.length).to.equal(1);
    });

    it('should throw if no rides', () => {
      const ridePayload = {
        id: 10,
        amount: 11,
        rider_id: 1
      };
      const rider = RiderFactory({ riderid: 1, rides: [] });
      expect(() => completeRide(ridePayload, rider)).to.throw();
      expect(rider.rides.length).to.equal(0);
    });
  });

  describe('computeLoyaltyPoint()', () => {
    it('should equal amount for bronze members', () => {
      expect(computeLoyaltyPoint(5, 0)).to.equal(5);
      expect(computeLoyaltyPoint(10, 19)).to.equal(10);
    });

    it('should equal amount * 3 for silver members', () => {
      expect(computeLoyaltyPoint(5, 20)).to.equal(15);
      expect(computeLoyaltyPoint(10, 49)).to.equal(30);
    });

    it('should equal amount * 5 for gold members', () => {
      expect(computeLoyaltyPoint(5, 50)).to.equal(25);
      expect(computeLoyaltyPoint(10, 99)).to.equal(50);
    });

    it('should equal amount * 10 for platinium members', () => {
      expect(computeLoyaltyPoint(5, 100)).to.equal(50);
      expect(computeLoyaltyPoint(10, 250)).to.equal(100);
    });
  });
});
