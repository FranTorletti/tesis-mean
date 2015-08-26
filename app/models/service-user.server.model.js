'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service user Schema
 */
var ServiceUserSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Service user name',
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

mongoose.model('ServiceUser', ServiceUserSchema);