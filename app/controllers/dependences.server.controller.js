'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dependence = mongoose.model('Dependence'),
	_ = require('lodash');

/**
 * Create a Dependence
 */
exports.create = function(req, res) {
	var dependence = new Dependence(req.body);
	dependence.user = req.user;

	dependence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependence);
		}
	});
};

/**
 * Show the current Dependence
 */
exports.read = function(req, res) {
	res.jsonp(req.dependence);
};

/**
 * Update a Dependence
 */
exports.update = function(req, res) {
	var dependence = req.dependence ;

	dependence = _.extend(dependence , req.body);

	dependence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependence);
		}
	});
};

/**
 * Delete an Dependence
 */
exports.delete = function(req, res) {
	var dependence = req.dependence ;

	dependence.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependence);
		}
	});
};

/**
 * List of Dependences
 */
exports.list = function(req, res) { 
	Dependence.find().sort('-created').populate('user', 'displayName').exec(function(err, dependences) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependences);
		}
	});
};

/**
 * Dependence middleware
 */
exports.dependenceByID = function(req, res, next, id) { 
	Dependence.findById(id).populate('user', 'displayName').exec(function(err, dependence) {
		if (err) return next(err);
		if (! dependence) return next(new Error('Failed to load Dependence ' + id));
		req.dependence = dependence ;
		next();
	});
};

/**
 * Dependence authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dependence.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
