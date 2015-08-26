'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var transactionTypes = require('../../app/controllers/transaction-types.server.controller');

	// Transaction types Routes
	app.route('/transaction-types')
		.get(transactionTypes.list)
		.post(users.requiresLogin, transactionTypes.create);

	app.route('/transaction-types/:transactionTypeId')
		.get(transactionTypes.read)
		.put(users.requiresLogin, transactionTypes.hasAuthorization, transactionTypes.update)
		.delete(users.requiresLogin, transactionTypes.hasAuthorization, transactionTypes.delete);

	// Finish by binding the Transaction type middleware
	app.param('transactionTypeId', transactionTypes.transactionTypeByID);
};
