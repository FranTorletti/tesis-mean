'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ServiceType = mongoose.model('ServiceType'),
	_ = require('lodash');

/**
 * Create a Service type
 */
exports.create = function(req, res) {
	var serviceType = new ServiceType(req.body);
	serviceType.user = req.user;

	serviceType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceType);
		}
	});
};

/**
 * Show the current Service type
 */
exports.read = function(req, res) {
	res.jsonp(req.serviceType);
};

/**
 * Update a Service type
 */
exports.update = function(req, res) {
	var serviceType = req.serviceType ;

	serviceType = _.extend(serviceType , req.body);

	serviceType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceType);
		}
	});
};

/**
 * Delete an Service type
 */
exports.delete = function(req, res) {
	var serviceType = req.serviceType ;

	serviceType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceType);
		}
	});
};

/**
 * List of Service types
 */
exports.list = function(req, res) { 
	ServiceType.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceTypes);
		}
	});
};

/**
 * Service type middleware
 */
exports.serviceTypeByID = function(req, res, next, id) { 
	ServiceType.findById(id).populate('user', 'displayName').exec(function(err, serviceType) {
		if (err) return next(err);
		if (! serviceType) return next(new Error('Failed to load Service type ' + id));
		req.serviceType = serviceType ;
		next();
	});
};

/**
 * Service type authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.serviceType.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
