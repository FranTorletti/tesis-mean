'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ServiceRecord = mongoose.model('ServiceRecord'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, serviceRecord;

/**
 * Service record routes tests
 */
describe('Service record CRUD tests', function() {
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

		// Save a user to the test db and create new Service record
		user.save(function() {
			serviceRecord = {
				name: 'Service record Name'
			};

			done();
		});
	});

	it('should be able to save Service record instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service record
				agent.post('/service-records')
					.send(serviceRecord)
					.expect(200)
					.end(function(serviceRecordSaveErr, serviceRecordSaveRes) {
						// Handle Service record save error
						if (serviceRecordSaveErr) done(serviceRecordSaveErr);

						// Get a list of Service records
						agent.get('/service-records')
							.end(function(serviceRecordsGetErr, serviceRecordsGetRes) {
								// Handle Service record save error
								if (serviceRecordsGetErr) done(serviceRecordsGetErr);

								// Get Service records list
								var serviceRecords = serviceRecordsGetRes.body;

								// Set assertions
								(serviceRecords[0].user._id).should.equal(userId);
								(serviceRecords[0].name).should.match('Service record Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Service record instance if not logged in', function(done) {
		agent.post('/service-records')
			.send(serviceRecord)
			.expect(401)
			.end(function(serviceRecordSaveErr, serviceRecordSaveRes) {
				// Call the assertion callback
				done(serviceRecordSaveErr);
			});
	});

	it('should not be able to save Service record instance if no name is provided', function(done) {
		// Invalidate name field
		serviceRecord.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service record
				agent.post('/service-records')
					.send(serviceRecord)
					.expect(400)
					.end(function(serviceRecordSaveErr, serviceRecordSaveRes) {
						// Set message assertion
						(serviceRecordSaveRes.body.message).should.match('Please fill Service record name');
						
						// Handle Service record save error
						done(serviceRecordSaveErr);
					});
			});
	});

	it('should be able to update Service record instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service record
				agent.post('/service-records')
					.send(serviceRecord)
					.expect(200)
					.end(function(serviceRecordSaveErr, serviceRecordSaveRes) {
						// Handle Service record save error
						if (serviceRecordSaveErr) done(serviceRecordSaveErr);

						// Update Service record name
						serviceRecord.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Service record
						agent.put('/service-records/' + serviceRecordSaveRes.body._id)
							.send(serviceRecord)
							.expect(200)
							.end(function(serviceRecordUpdateErr, serviceRecordUpdateRes) {
								// Handle Service record update error
								if (serviceRecordUpdateErr) done(serviceRecordUpdateErr);

								// Set assertions
								(serviceRecordUpdateRes.body._id).should.equal(serviceRecordSaveRes.body._id);
								(serviceRecordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Service records if not signed in', function(done) {
		// Create new Service record model instance
		var serviceRecordObj = new ServiceRecord(serviceRecord);

		// Save the Service record
		serviceRecordObj.save(function() {
			// Request Service records
			request(app).get('/service-records')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Service record if not signed in', function(done) {
		// Create new Service record model instance
		var serviceRecordObj = new ServiceRecord(serviceRecord);

		// Save the Service record
		serviceRecordObj.save(function() {
			request(app).get('/service-records/' + serviceRecordObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', serviceRecord.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Service record instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service record
				agent.post('/service-records')
					.send(serviceRecord)
					.expect(200)
					.end(function(serviceRecordSaveErr, serviceRecordSaveRes) {
						// Handle Service record save error
						if (serviceRecordSaveErr) done(serviceRecordSaveErr);

						// Delete existing Service record
						agent.delete('/service-records/' + serviceRecordSaveRes.body._id)
							.send(serviceRecord)
							.expect(200)
							.end(function(serviceRecordDeleteErr, serviceRecordDeleteRes) {
								// Handle Service record error error
								if (serviceRecordDeleteErr) done(serviceRecordDeleteErr);

								// Set assertions
								(serviceRecordDeleteRes.body._id).should.equal(serviceRecordSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Service record instance if not signed in', function(done) {
		// Set Service record user 
		serviceRecord.user = user;

		// Create new Service record model instance
		var serviceRecordObj = new ServiceRecord(serviceRecord);

		// Save the Service record
		serviceRecordObj.save(function() {
			// Try deleting Service record
			request(app).delete('/service-records/' + serviceRecordObj._id)
			.expect(401)
			.end(function(serviceRecordDeleteErr, serviceRecordDeleteRes) {
				// Set message assertion
				(serviceRecordDeleteRes.body.message).should.match('User is not logged in');

				// Handle Service record error error
				done(serviceRecordDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ServiceRecord.remove().exec();
		done();
	});
});