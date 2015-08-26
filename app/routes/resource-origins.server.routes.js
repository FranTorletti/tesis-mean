'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var resourceOrigins = require('../../app/controllers/resource-origins.server.controller');

	// Resource origins Routes
	app.route('/resource-origins')
		.get(resourceOrigins.list)
		.post(users.requiresLogin, resourceOrigins.create);

	app.route('/resource-origins/:resourceOriginId')
		.get(resourceOrigins.read)
		.put(users.requiresLogin, resourceOrigins.hasAuthorization, resourceOrigins.update)
		.delete(users.requiresLogin, resourceOrigins.hasAuthorization, resourceOrigins.delete);

	// Finish by binding the Resource origin middleware
	app.param('resourceOriginId', resourceOrigins.resourceOriginByID);
};
