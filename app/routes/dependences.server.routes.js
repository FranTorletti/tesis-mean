'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dependences = require('../../app/controllers/dependences.server.controller');

	// Dependences Routes
	app.route('/dependences')
		.get(dependences.list)
		.post(users.requiresLogin, dependences.create);

	app.route('/dependences/:dependenceId')
		.get(dependences.read)
		.put(users.requiresLogin, dependences.hasAuthorization, dependences.update)
		.delete(users.requiresLogin, dependences.hasAuthorization, dependences.delete);

	// Finish by binding the Dependence middleware
	app.param('dependenceId', dependences.dependenceByID);
};
