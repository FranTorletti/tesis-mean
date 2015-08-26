'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var serviceUsers = require('../../app/controllers/service-users.server.controller');

	// Service users Routes
	app.route('/service-users')
		.get(serviceUsers.list)
		.post(users.requiresLogin, serviceUsers.create);

	app.route('/service-users/:serviceUserId')
		.get(serviceUsers.read)
		.put(users.requiresLogin, serviceUsers.hasAuthorization, serviceUsers.update)
		.delete(users.requiresLogin, serviceUsers.hasAuthorization, serviceUsers.delete);

	// Finish by binding the Service user middleware
	app.param('serviceUserId', serviceUsers.serviceUserByID);
};
