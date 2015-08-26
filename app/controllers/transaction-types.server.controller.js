'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	TransactionType = mongoose.model('TransactionType'),
	_ = require('lodash');

/**
 * Create a Transaction type
 */
exports.create = function(req, res) {
	var transactionType = new TransactionType(req.body);
	transactionType.user = req.user;

	transactionType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transactionType);
		}
	});
};

/**
 * Show the current Transaction type
 */
exports.read = function(req, res) {
	res.jsonp(req.transactionType);
};

/**
 * Update a Transaction type
 */
exports.update = function(req, res) {
	var transactionType = req.transactionType ;

	transactionType = _.extend(transactionType , req.body);

	transactionType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transactionType);
		}
	});
};

/**
 * Delete an Transaction type
 */
exports.delete = function(req, res) {
	var transactionType = req.transactionType ;

	transactionType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transactionType);
		}
	});
};

/**
 * List of Transaction types
 */
exports.list = function(req, res) { 
	TransactionType.find().sort('-created').populate('user', 'displayName').exec(function(err, transactionTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transactionTypes);
		}
	});
};

/**
 * Transaction type middleware
 */
exports.transactionTypeByID = function(req, res, next, id) { 
	TransactionType.findById(id).populate('user', 'displayName').exec(function(err, transactionType) {
		if (err) return next(err);
		if (! transactionType) return next(new Error('Failed to load Transaction type ' + id));
		req.transactionType = transactionType ;
		next();
	});
};

/**
 * Transaction type authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.transactionType.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
