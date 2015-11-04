'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ResourceOrigin = mongoose.model('ResourceOrigin'),
	_ = require('lodash');

/**
 * Create a Resource origin
 */
exports.create = function(req, res) {
	var resourceOrigin = new ResourceOrigin(req.body);
	resourceOrigin.user = req.user;

	resourceOrigin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resourceOrigin);
		}
	});
};

/**
 * Show the current Resource origin
 */
exports.read = function(req, res) {
	res.jsonp(req.resourceOrigin);
};

/**
 * Update a Resource origin
 */
exports.update = function(req, res) {
	var resourceOrigin = req.resourceOrigin ;

	resourceOrigin = _.extend(resourceOrigin , req.body);

	resourceOrigin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resourceOrigin);
		}
	});
};

/**
 * Delete an Resource origin
 */
exports.delete = function(req, res) {
	var resourceOrigin = req.resourceOrigin ;

	resourceOrigin.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resourceOrigin);
		}
	});
};

/**
 * List of Resource origins
 */
exports.list = function(req, res) { 
	ResourceOrigin.find().sort('-created').populate('user', 'displayName').exec(function(err, resourceOrigins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resourceOrigins);
		}
	});
};

/**
 * Resource origin middleware
 */
exports.resourceOriginByID = function(req, res, next, id) { 
	ResourceOrigin.findById(id).populate('user', 'displayName').exec(function(err, resourceOrigin) {
		if (err) return next(err);
		if (! resourceOrigin) return next(new Error('Failed to load Resource origin ' + id));
		req.resourceOrigin = resourceOrigin ;
		next();
	});
};

/**
 * Resource origin authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
