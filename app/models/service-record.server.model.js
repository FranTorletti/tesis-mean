'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service record Schema
 */
var ServiceRecordSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Service record name',
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

mongoose.model('ServiceRecord', ServiceRecordSchema);