'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transaction type Schema
 */
var TransactionTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Transaction type name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('TransactionType', TransactionTypeSchema);