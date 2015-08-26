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
	name: {
		type: String,
		default: '',
		required: 'Please fill Dependence name',
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

mongoose.model('Dependence', DependenceSchema);