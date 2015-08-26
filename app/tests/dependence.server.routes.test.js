'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dependence = mongoose.model('Dependence'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dependence;

/**
 * Dependence routes tests
 */
describe('Dependence CRUD tests', function() {
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

		// Save a user to the test db and create new Dependence
		user.save(function() {
			dependence = {
				name: 'Dependence Name'
			};

			done();
		});
	});

	it('should be able to save Dependence instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependence
				agent.post('/dependences')
					.send(dependence)
					.expect(200)
					.end(function(dependenceSaveErr, dependenceSaveRes) {
						// Handle Dependence save error
						if (dependenceSaveErr) done(dependenceSaveErr);

						// Get a list of Dependences
						agent.get('/dependences')
							.end(function(dependencesGetErr, dependencesGetRes) {
								// Handle Dependence save error
								if (dependencesGetErr) done(dependencesGetErr);

								// Get Dependences list
								var dependences = dependencesGetRes.body;

								// Set assertions
								(dependences[0].user._id).should.equal(userId);
								(dependences[0].name).should.match('Dependence Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dependence instance if not logged in', function(done) {
		agent.post('/dependences')
			.send(dependence)
			.expect(401)
			.end(function(dependenceSaveErr, dependenceSaveRes) {
				// Call the assertion callback
				done(dependenceSaveErr);
			});
	});

	it('should not be able to save Dependence instance if no name is provided', function(done) {
		// Invalidate name field
		dependence.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependence
				agent.post('/dependences')
					.send(dependence)
					.expect(400)
					.end(function(dependenceSaveErr, dependenceSaveRes) {
						// Set message assertion
						(dependenceSaveRes.body.message).should.match('Please fill Dependence name');
						
						// Handle Dependence save error
						done(dependenceSaveErr);
					});
			});
	});

	it('should be able to update Dependence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependence
				agent.post('/dependences')
					.send(dependence)
					.expect(200)
					.end(function(dependenceSaveErr, dependenceSaveRes) {
						// Handle Dependence save error
						if (dependenceSaveErr) done(dependenceSaveErr);

						// Update Dependence name
						dependence.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dependence
						agent.put('/dependences/' + dependenceSaveRes.body._id)
							.send(dependence)
							.expect(200)
							.end(function(dependenceUpdateErr, dependenceUpdateRes) {
								// Handle Dependence update error
								if (dependenceUpdateErr) done(dependenceUpdateErr);

								// Set assertions
								(dependenceUpdateRes.body._id).should.equal(dependenceSaveRes.body._id);
								(dependenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dependences if not signed in', function(done) {
		// Create new Dependence model instance
		var dependenceObj = new Dependence(dependence);

		// Save the Dependence
		dependenceObj.save(function() {
			// Request Dependences
			request(app).get('/dependences')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dependence if not signed in', function(done) {
		// Create new Dependence model instance
		var dependenceObj = new Dependence(dependence);

		// Save the Dependence
		dependenceObj.save(function() {
			request(app).get('/dependences/' + dependenceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dependence.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dependence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependence
				agent.post('/dependences')
					.send(dependence)
					.expect(200)
					.end(function(dependenceSaveErr, dependenceSaveRes) {
						// Handle Dependence save error
						if (dependenceSaveErr) done(dependenceSaveErr);

						// Delete existing Dependence
						agent.delete('/dependences/' + dependenceSaveRes.body._id)
							.send(dependence)
							.expect(200)
							.end(function(dependenceDeleteErr, dependenceDeleteRes) {
								// Handle Dependence error error
								if (dependenceDeleteErr) done(dependenceDeleteErr);

								// Set assertions
								(dependenceDeleteRes.body._id).should.equal(dependenceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dependence instance if not signed in', function(done) {
		// Set Dependence user 
		dependence.user = user;

		// Create new Dependence model instance
		var dependenceObj = new Dependence(dependence);

		// Save the Dependence
		dependenceObj.save(function() {
			// Try deleting Dependence
			request(app).delete('/dependences/' + dependenceObj._id)
			.expect(401)
			.end(function(dependenceDeleteErr, dependenceDeleteRes) {
				// Set message assertion
				(dependenceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dependence error error
				done(dependenceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dependence.remove().exec();
		done();
	});
});