'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ServiceRecord = mongoose.model('ServiceRecord');

/**
 * Globals
 */
var user, serviceRecord;

/**
 * Unit tests
 */
describe('Service record Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			serviceRecord = new ServiceRecord({
				name: 'Service record Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return serviceRecord.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			serviceRecord.name = '';

			return serviceRecord.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ServiceRecord.remove().exec();
		User.remove().exec();

		done();
	});
});