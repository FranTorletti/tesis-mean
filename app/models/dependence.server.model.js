'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dependence Schema
 */
var DependenceSchema = new Schema({
	code: {
		type: String,
		default: '',
		required: 'Please fill Dependence code',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Dependence descrition'
	},
	services: [{
			type: Schema.ObjectId,
			ref: 'Service'
	}]
});

mongoose.model('Dependence', DependenceSchema);