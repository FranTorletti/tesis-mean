'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var serviceTypes = require('../../app/controllers/service-types.server.controller');

	// Service types Routes
	app.route('/service-types')
		.get(serviceTypes.list)
		.post(users.requiresLogin, serviceTypes.create);

	app.route('/service-types/:serviceTypeId')
		.get(serviceTypes.read)
		.put(users.requiresLogin, serviceTypes.hasAuthorization, serviceTypes.update)
		.delete(users.requiresLogin, serviceTypes.hasAuthorization, serviceTypes.delete);

	// Finish by binding the Service type middleware
	app.param('serviceTypeId', serviceTypes.serviceTypeByID);
};
