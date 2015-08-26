'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ServiceUser = mongoose.model('ServiceUser'),
	_ = require('lodash');

/**
 * Create a Service user
 */
exports.create = function(req, res) {
	var serviceUser = new ServiceUser(req.body);
	serviceUser.user = req.user;

	serviceUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceUser);
		}
	});
};

/**
 * Show the current Service user
 */
exports.read = function(req, res) {
	res.jsonp(req.serviceUser);
};

/**
 * Update a Service user
 */
exports.update = function(req, res) {
	var serviceUser = req.serviceUser ;

	serviceUser = _.extend(serviceUser , req.body);

	serviceUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceUser);
		}
	});
};

/**
 * Delete an Service user
 */
exports.delete = function(req, res) {
	var serviceUser = req.serviceUser ;

	serviceUser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceUser);
		}
	});
};

/**
 * List of Service users
 */
exports.list = function(req, res) { 
	ServiceUser.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceUsers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceUsers);
		}
	});
};

/**
 * Service user middleware
 */
exports.serviceUserByID = function(req, res, next, id) { 
	ServiceUser.findById(id).populate('user', 'displayName').exec(function(err, serviceUser) {
		if (err) return next(err);
		if (! serviceUser) return next(new Error('Failed to load Service user ' + id));
		req.serviceUser = serviceUser ;
		next();
	});
};

/**
 * Service user authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.serviceUser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
