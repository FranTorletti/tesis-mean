'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ServiceType = mongoose.model('ServiceType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, serviceType;

/**
 * Service type routes tests
 */
describe('Service type CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Service type
		user.save(function() {
			serviceType = {
				name: 'Service type Name'
			};

			done();
		});
	});

	it('should be able to save Service type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service type
				agent.post('/service-types')
					.send(serviceType)
					.expect(200)
					.end(function(serviceTypeSaveErr, serviceTypeSaveRes) {
						// Handle Service type save error
						if (serviceTypeSaveErr) done(serviceTypeSaveErr);

						// Get a list of Service types
						agent.get('/service-types')
							.end(function(serviceTypesGetErr, serviceTypesGetRes) {
								// Handle Service type save error
								if (serviceTypesGetErr) done(serviceTypesGetErr);

								// Get Service types list
								var serviceTypes = serviceTypesGetRes.body;

								// Set assertions
								(serviceTypes[0].user._id).should.equal(userId);
								(serviceTypes[0].name).should.match('Service type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Service type instance if not logged in', function(done) {
		agent.post('/service-types')
			.send(serviceType)
			.expect(401)
			.end(function(serviceTypeSaveErr, serviceTypeSaveRes) {
				// Call the assertion callback
				done(serviceTypeSaveErr);
			});
	});

	it('should not be able to save Service type instance if no name is provided', function(done) {
		// Invalidate name field
		serviceType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service type
				agent.post('/service-types')
					.send(serviceType)
					.expect(400)
					.end(function(serviceTypeSaveErr, serviceTypeSaveRes) {
						// Set message assertion
						(serviceTypeSaveRes.body.message).should.match('Please fill Service type name');
						
						// Handle Service type save error
						done(serviceTypeSaveErr);
					});
			});
	});

	it('should be able to update Service type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service type
				agent.post('/service-types')
					.send(serviceType)
					.expect(200)
					.end(function(serviceTypeSaveErr, serviceTypeSaveRes) {
						// Handle Service type save error
						if (serviceTypeSaveErr) done(serviceTypeSaveErr);

						// Update Service type name
						serviceType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Service type
						agent.put('/service-types/' + serviceTypeSaveRes.body._id)
							.send(serviceType)
							.expect(200)
							.end(function(serviceTypeUpdateErr, serviceTypeUpdateRes) {
								// Handle Service type update error
								if (serviceTypeUpdateErr) done(serviceTypeUpdateErr);

								// Set assertions
								(serviceTypeUpdateRes.body._id).should.equal(serviceTypeSaveRes.body._id);
								(serviceTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Service types if not signed in', function(done) {
		// Create new Service type model instance
		var serviceTypeObj = new ServiceType(serviceType);

		// Save the Service type
		serviceTypeObj.save(function() {
			// Request Service types
			request(app).get('/service-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Service type if not signed in', function(done) {
		// Create new Service type model instance
		var serviceTypeObj = new ServiceType(serviceType);

		// Save the Service type
		serviceTypeObj.save(function() {
			request(app).get('/service-types/' + serviceTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', serviceType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Service type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service type
				agent.post('/service-types')
					.send(serviceType)
					.expect(200)
					.end(function(serviceTypeSaveErr, serviceTypeSaveRes) {
						// Handle Service type save error
						if (serviceTypeSaveErr) done(serviceTypeSaveErr);

						// Delete existing Service type
						agent.delete('/service-types/' + serviceTypeSaveRes.body._id)
							.send(serviceType)
							.expect(200)
							.end(function(serviceTypeDeleteErr, serviceTypeDeleteRes) {
								// Handle Service type error error
								if (serviceTypeDeleteErr) done(serviceTypeDeleteErr);

								// Set assertions
								(serviceTypeDeleteRes.body._id).should.equal(serviceTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Service type instance if not signed in', function(done) {
		// Set Service type user 
		serviceType.user = user;

		// Create new Service type model instance
		var serviceTypeObj = new ServiceType(serviceType);

		// Save the Service type
		serviceTypeObj.save(function() {
			// Try deleting Service type
			request(app).delete('/service-types/' + serviceTypeObj._id)
			.expect(401)
			.end(function(serviceTypeDeleteErr, serviceTypeDeleteRes) {
				// Set message assertion
				(serviceTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Service type error error
				done(serviceTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ServiceType.remove().exec();
		done();
	});
});