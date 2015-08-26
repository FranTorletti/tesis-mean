'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transaction Schema
 */
var TransactionSchema = new Schema({
	code: {
		type: String,
		default: '',
		required: 'Please fill Transaction code',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	descrition: {
		type: String,
		default: '',
		required: 'Please fill Transaction descrition'
	},
	amount: {
		type: Number,
		default: 0,
		required: 'Please fill Transaction amount'
	},
	retention_of_faculty: {
		type: Number,
		default: 0,
		required: 'Please fill Transaction retention of faculty'
	},
	retention_of_university: {
		type: Number,
		default: 0,
		required: 'Please fill Transaction retention of faculty'
	},
	service: {
			type: Schema.ObjectId,
			ref: 'Service'
	},
	transaction_type: {
		type: Schema.ObjectId,
		ref: 'TransactionType'
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Transaction', TransactionSchema);