'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ServiceUser = mongoose.model('ServiceUser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, serviceUser;

/**
 * Service user routes tests
 */
describe('Service user CRUD tests', function() {
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

		// Save a user to the test db and create new Service user
		user.save(function() {
			serviceUser = {
				name: 'Service user Name'
			};

			done();
		});
	});

	it('should be able to save Service user instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service user
				agent.post('/service-users')
					.send(serviceUser)
					.expect(200)
					.end(function(serviceUserSaveErr, serviceUserSaveRes) {
						// Handle Service user save error
						if (serviceUserSaveErr) done(serviceUserSaveErr);

						// Get a list of Service users
						agent.get('/service-users')
							.end(function(serviceUsersGetErr, serviceUsersGetRes) {
								// Handle Service user save error
								if (serviceUsersGetErr) done(serviceUsersGetErr);

								// Get Service users list
								var serviceUsers = serviceUsersGetRes.body;

								// Set assertions
								(serviceUsers[0].user._id).should.equal(userId);
								(serviceUsers[0].name).should.match('Service user Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Service user instance if not logged in', function(done) {
		agent.post('/service-users')
			.send(serviceUser)
			.expect(401)
			.end(function(serviceUserSaveErr, serviceUserSaveRes) {
				// Call the assertion callback
				done(serviceUserSaveErr);
			});
	});

	it('should not be able to save Service user instance if no name is provided', function(done) {
		// Invalidate name field
		serviceUser.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service user
				agent.post('/service-users')
					.send(serviceUser)
					.expect(400)
					.end(function(serviceUserSaveErr, serviceUserSaveRes) {
						// Set message assertion
						(serviceUserSaveRes.body.message).should.match('Please fill Service user name');
						
						// Handle Service user save error
						done(serviceUserSaveErr);
					});
			});
	});

	it('should be able to update Service user instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service user
				agent.post('/service-users')
					.send(serviceUser)
					.expect(200)
					.end(function(serviceUserSaveErr, serviceUserSaveRes) {
						// Handle Service user save error
						if (serviceUserSaveErr) done(serviceUserSaveErr);

						// Update Service user name
						serviceUser.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Service user
						agent.put('/service-users/' + serviceUserSaveRes.body._id)
							.send(serviceUser)
							.expect(200)
							.end(function(serviceUserUpdateErr, serviceUserUpdateRes) {
								// Handle Service user update error
								if (serviceUserUpdateErr) done(serviceUserUpdateErr);

								// Set assertions
								(serviceUserUpdateRes.body._id).should.equal(serviceUserSaveRes.body._id);
								(serviceUserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Service users if not signed in', function(done) {
		// Create new Service user model instance
		var serviceUserObj = new ServiceUser(serviceUser);

		// Save the Service user
		serviceUserObj.save(function() {
			// Request Service users
			request(app).get('/service-users')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Service user if not signed in', function(done) {
		// Create new Service user model instance
		var serviceUserObj = new ServiceUser(serviceUser);

		// Save the Service user
		serviceUserObj.save(function() {
			request(app).get('/service-users/' + serviceUserObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', serviceUser.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Service user instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service user
				agent.post('/service-users')
					.send(serviceUser)
					.expect(200)
					.end(function(serviceUserSaveErr, serviceUserSaveRes) {
						// Handle Service user save error
						if (serviceUserSaveErr) done(serviceUserSaveErr);

						// Delete existing Service user
						agent.delete('/service-users/' + serviceUserSaveRes.body._id)
							.send(serviceUser)
							.expect(200)
							.end(function(serviceUserDeleteErr, serviceUserDeleteRes) {
								// Handle Service user error error
								if (serviceUserDeleteErr) done(serviceUserDeleteErr);

								// Set assertions
								(serviceUserDeleteRes.body._id).should.equal(serviceUserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Service user instance if not signed in', function(done) {
		// Set Service user user 
		serviceUser.user = user;

		// Create new Service user model instance
		var serviceUserObj = new ServiceUser(serviceUser);

		// Save the Service user
		serviceUserObj.save(function() {
			// Try deleting Service user
			request(app).delete('/service-users/' + serviceUserObj._id)
			.expect(401)
			.end(function(serviceUserDeleteErr, serviceUserDeleteRes) {
				// Set message assertion
				(serviceUserDeleteRes.body.message).should.match('User is not logged in');

				// Handle Service user error error
				done(serviceUserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ServiceUser.remove().exec();
		done();
	});
});