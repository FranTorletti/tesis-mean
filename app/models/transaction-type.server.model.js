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
	description: {
		type: String,
		default: '',
		required: 'Please fill TransactionType description'
	},
	type : {
		type: String,
		trim:true,
		required: 'Please fill TransactionType type',	
		enum: ['INGRESS','EGRESS']
	}
});

mongoose.model('TransactionType', TransactionTypeSchema);