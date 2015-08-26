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
	name: {
		type: String,
		default: '',
		required: 'Please fill Resource origin name',
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

mongoose.model('ResourceOrigin', ResourceOriginSchema);