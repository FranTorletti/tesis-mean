'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ServiceRecord = mongoose.model('ServiceRecord'),
	_ = require('lodash');

/**
 * Create a Service record
 */
exports.create = function(req, res) {
	var serviceRecord = new ServiceRecord(req.body);
	serviceRecord.user = req.user;

	serviceRecord.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceRecord);
		}
	});
};

/**
 * Show the current Service record
 */
exports.read = function(req, res) {
	res.jsonp(req.serviceRecord);
};

/**
 * Update a Service record
 */
exports.update = function(req, res) {
	var serviceRecord = req.serviceRecord ;

	serviceRecord = _.extend(serviceRecord , req.body);

	serviceRecord.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceRecord);
		}
	});
};

/**
 * Delete an Service record
 */
exports.delete = function(req, res) {
	var serviceRecord = req.serviceRecord ;

	serviceRecord.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceRecord);
		}
	});
};

/**
 * List of Service records
 */
exports.list = function(req, res) { 
	ServiceRecord.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceRecords) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceRecords);
		}
	});
};

/**
 * Service record middleware
 */
exports.serviceRecordByID = function(req, res, next, id) { 
	ServiceRecord.findById(id).populate('user', 'displayName').exec(function(err, serviceRecord) {
		if (err) return next(err);
		if (! serviceRecord) return next(new Error('Failed to load Service record ' + id));
		req.serviceRecord = serviceRecord ;
		next();
	});
};

/**
 * Service record authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.serviceRecord.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
