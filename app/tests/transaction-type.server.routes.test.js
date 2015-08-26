'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TransactionType = mongoose.model('TransactionType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, transactionType;

/**
 * Transaction type routes tests
 */
describe('Transaction type CRUD tests', function() {
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

		// Save a user to the test db and create new Transaction type
		user.save(function() {
			transactionType = {
				name: 'Transaction type Name'
			};

			done();
		});
	});

	it('should be able to save Transaction type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transaction type
				agent.post('/transaction-types')
					.send(transactionType)
					.expect(200)
					.end(function(transactionTypeSaveErr, transactionTypeSaveRes) {
						// Handle Transaction type save error
						if (transactionTypeSaveErr) done(transactionTypeSaveErr);

						// Get a list of Transaction types
						agent.get('/transaction-types')
							.end(function(transactionTypesGetErr, transactionTypesGetRes) {
								// Handle Transaction type save error
								if (transactionTypesGetErr) done(transactionTypesGetErr);

								// Get Transaction types list
								var transactionTypes = transactionTypesGetRes.body;

								// Set assertions
								(transactionTypes[0].user._id).should.equal(userId);
								(transactionTypes[0].name).should.match('Transaction type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Transaction type instance if not logged in', function(done) {
		agent.post('/transaction-types')
			.send(transactionType)
			.expect(401)
			.end(function(transactionTypeSaveErr, transactionTypeSaveRes) {
				// Call the assertion callback
				done(transactionTypeSaveErr);
			});
	});

	it('should not be able to save Transaction type instance if no name is provided', function(done) {
		// Invalidate name field
		transactionType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transaction type
				agent.post('/transaction-types')
					.send(transactionType)
					.expect(400)
					.end(function(transactionTypeSaveErr, transactionTypeSaveRes) {
						// Set message assertion
						(transactionTypeSaveRes.body.message).should.match('Please fill Transaction type name');
						
						// Handle Transaction type save error
						done(transactionTypeSaveErr);
					});
			});
	});

	it('should be able to update Transaction type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transaction type
				agent.post('/transaction-types')
					.send(transactionType)
					.expect(200)
					.end(function(transactionTypeSaveErr, transactionTypeSaveRes) {
						// Handle Transaction type save error
						if (transactionTypeSaveErr) done(transactionTypeSaveErr);

						// Update Transaction type name
						transactionType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Transaction type
						agent.put('/transaction-types/' + transactionTypeSaveRes.body._id)
							.send(transactionType)
							.expect(200)
							.end(function(transactionTypeUpdateErr, transactionTypeUpdateRes) {
								// Handle Transaction type update error
								if (transactionTypeUpdateErr) done(transactionTypeUpdateErr);

								// Set assertions
								(transactionTypeUpdateRes.body._id).should.equal(transactionTypeSaveRes.body._id);
								(transactionTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Transaction types if not signed in', function(done) {
		// Create new Transaction type model instance
		var transactionTypeObj = new TransactionType(transactionType);

		// Save the Transaction type
		transactionTypeObj.save(function() {
			// Request Transaction types
			request(app).get('/transaction-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Transaction type if not signed in', function(done) {
		// Create new Transaction type model instance
		var transactionTypeObj = new TransactionType(transactionType);

		// Save the Transaction type
		transactionTypeObj.save(function() {
			request(app).get('/transaction-types/' + transactionTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', transactionType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Transaction type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transaction type
				agent.post('/transaction-types')
					.send(transactionType)
					.expect(200)
					.end(function(transactionTypeSaveErr, transactionTypeSaveRes) {
						// Handle Transaction type save error
						if (transactionTypeSaveErr) done(transactionTypeSaveErr);

						// Delete existing Transaction type
						agent.delete('/transaction-types/' + transactionTypeSaveRes.body._id)
							.send(transactionType)
							.expect(200)
							.end(function(transactionTypeDeleteErr, transactionTypeDeleteRes) {
								// Handle Transaction type error error
								if (transactionTypeDeleteErr) done(transactionTypeDeleteErr);

								// Set assertions
								(transactionTypeDeleteRes.body._id).should.equal(transactionTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Transaction type instance if not signed in', function(done) {
		// Set Transaction type user 
		transactionType.user = user;

		// Create new Transaction type model instance
		var transactionTypeObj = new TransactionType(transactionType);

		// Save the Transaction type
		transactionTypeObj.save(function() {
			// Try deleting Transaction type
			request(app).delete('/transaction-types/' + transactionTypeObj._id)
			.expect(401)
			.end(function(transactionTypeDeleteErr, transactionTypeDeleteRes) {
				// Set message assertion
				(transactionTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Transaction type error error
				done(transactionTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		TransactionType.remove().exec();
		done();
	});
});