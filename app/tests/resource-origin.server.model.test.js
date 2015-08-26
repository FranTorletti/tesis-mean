'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ResourceOrigin = mongoose.model('ResourceOrigin');

/**
 * Globals
 */
var user, resourceOrigin;

/**
 * Unit tests
 */
describe('Resource origin Model Unit Tests:', function() {
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
			resourceOrigin = new ResourceOrigin({
				name: 'Resource origin Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return resourceOrigin.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			resourceOrigin.name = '';

			return resourceOrigin.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ResourceOrigin.remove().exec();
		User.remove().exec();

		done();
	});
});