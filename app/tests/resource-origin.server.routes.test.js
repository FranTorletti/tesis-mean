'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ResourceOrigin = mongoose.model('ResourceOrigin'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, resourceOrigin;

/**
 * Resource origin routes tests
 */
describe('Resource origin CRUD tests', function() {
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

		// Save a user to the test db and create new Resource origin
		user.save(function() {
			resourceOrigin = {
				name: 'Resource origin Name'
			};

			done();
		});
	});

	it('should be able to save Resource origin instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resource origin
				agent.post('/resource-origins')
					.send(resourceOrigin)
					.expect(200)
					.end(function(resourceOriginSaveErr, resourceOriginSaveRes) {
						// Handle Resource origin save error
						if (resourceOriginSaveErr) done(resourceOriginSaveErr);

						// Get a list of Resource origins
						agent.get('/resource-origins')
							.end(function(resourceOriginsGetErr, resourceOriginsGetRes) {
								// Handle Resource origin save error
								if (resourceOriginsGetErr) done(resourceOriginsGetErr);

								// Get Resource origins list
								var resourceOrigins = resourceOriginsGetRes.body;

								// Set assertions
								(resourceOrigins[0].user._id).should.equal(userId);
								(resourceOrigins[0].name).should.match('Resource origin Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Resource origin instance if not logged in', function(done) {
		agent.post('/resource-origins')
			.send(resourceOrigin)
			.expect(401)
			.end(function(resourceOriginSaveErr, resourceOriginSaveRes) {
				// Call the assertion callback
				done(resourceOriginSaveErr);
			});
	});

	it('should not be able to save Resource origin instance if no name is provided', function(done) {
		// Invalidate name field
		resourceOrigin.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resource origin
				agent.post('/resource-origins')
					.send(resourceOrigin)
					.expect(400)
					.end(function(resourceOriginSaveErr, resourceOriginSaveRes) {
						// Set message assertion
						(resourceOriginSaveRes.body.message).should.match('Please fill Resource origin name');
						
						// Handle Resource origin save error
						done(resourceOriginSaveErr);
					});
			});
	});

	it('should be able to update Resource origin instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resource origin
				agent.post('/resource-origins')
					.send(resourceOrigin)
					.expect(200)
					.end(function(resourceOriginSaveErr, resourceOriginSaveRes) {
						// Handle Resource origin save error
						if (resourceOriginSaveErr) done(resourceOriginSaveErr);

						// Update Resource origin name
						resourceOrigin.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Resource origin
						agent.put('/resource-origins/' + resourceOriginSaveRes.body._id)
							.send(resourceOrigin)
							.expect(200)
							.end(function(resourceOriginUpdateErr, resourceOriginUpdateRes) {
								// Handle Resource origin update error
								if (resourceOriginUpdateErr) done(resourceOriginUpdateErr);

								// Set assertions
								(resourceOriginUpdateRes.body._id).should.equal(resourceOriginSaveRes.body._id);
								(resourceOriginUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Resource origins if not signed in', function(done) {
		// Create new Resource origin model instance
		var resourceOriginObj = new ResourceOrigin(resourceOrigin);

		// Save the Resource origin
		resourceOriginObj.save(function() {
			// Request Resource origins
			request(app).get('/resource-origins')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Resource origin if not signed in', function(done) {
		// Create new Resource origin model instance
		var resourceOriginObj = new ResourceOrigin(resourceOrigin);

		// Save the Resource origin
		resourceOriginObj.save(function() {
			request(app).get('/resource-origins/' + resourceOriginObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', resourceOrigin.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Resource origin instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resource origin
				agent.post('/resource-origins')
					.send(resourceOrigin)
					.expect(200)
					.end(function(resourceOriginSaveErr, resourceOriginSaveRes) {
						// Handle Resource origin save error
						if (resourceOriginSaveErr) done(resourceOriginSaveErr);

						// Delete existing Resource origin
						agent.delete('/resource-origins/' + resourceOriginSaveRes.body._id)
							.send(resourceOrigin)
							.expect(200)
							.end(function(resourceOriginDeleteErr, resourceOriginDeleteRes) {
								// Handle Resource origin error error
								if (resourceOriginDeleteErr) done(resourceOriginDeleteErr);

								// Set assertions
								(resourceOriginDeleteRes.body._id).should.equal(resourceOriginSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Resource origin instance if not signed in', function(done) {
		// Set Resource origin user 
		resourceOrigin.user = user;

		// Create new Resource origin model instance
		var resourceOriginObj = new ResourceOrigin(resourceOrigin);

		// Save the Resource origin
		resourceOriginObj.save(function() {
			// Try deleting Resource origin
			request(app).delete('/resource-origins/' + resourceOriginObj._id)
			.expect(401)
			.end(function(resourceOriginDeleteErr, resourceOriginDeleteRes) {
				// Set message assertion
				(resourceOriginDeleteRes.body.message).should.match('User is not logged in');

				// Handle Resource origin error error
				done(resourceOriginDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ResourceOrigin.remove().exec();
		done();
	});
});