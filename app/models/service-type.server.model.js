'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service type Schema
 */
var ServiceTypeSchema = new Schema({
	code: {
		type: String,
		default: '',
		required: 'Please fill Service Type code',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Service Type description'
	},
	note: {
		type: String,
		default: '',
		required: 'Please fill Service Type note'
	},
	retention_of_faculty: {
		type: Number,
		default: 0,
		required: 'Please fill Service Type retention of faculty'
	},
	retention_of_university: {
		type: Number,
		default: 0,
		required: 'Please fill Service Type retention of faculty'
	},
	services: [{
			type: Schema.ObjectId,
			ref: 'Service'
	}]
});

mongoose.model('ServiceType', ServiceTypeSchema);