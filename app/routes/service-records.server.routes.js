'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var serviceRecords = require('../../app/controllers/service-records.server.controller');

	// Service records Routes
	app.route('/service-records')
		.get(serviceRecords.list)
		.post(users.requiresLogin, serviceRecords.create);

	app.route('/service-records/:serviceRecordId')
		.get(serviceRecords.read)
		.put(users.requiresLogin, serviceRecords.hasAuthorization, serviceRecords.update)
		.delete(users.requiresLogin, serviceRecords.hasAuthorization, serviceRecords.delete);

	// Finish by binding the Service record middleware
	app.param('serviceRecordId', serviceRecords.serviceRecordByID);
};
