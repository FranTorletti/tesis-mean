'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Resource origin Schema
 */
var ResourceOriginSchema = new Schema({
	code: {
		type: String,
		default: '',
		required: 'Please fill Resource origin code',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Resource origin descrition'
	},
	note: {
		type: String,
		default: '',
		required: 'Please fill Resource origin note'
	},
	services: [{
			type: Schema.ObjectId,
			ref: 'Service'
	}]
});

mongoose.model('ResourceOrigin', ResourceOriginSchema);