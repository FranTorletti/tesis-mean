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
	code: {
		type: String,
		default: '',
		required: 'Please fill ServiceRecord code',
		trim: true
	},
	dependence: {
			type: Schema.ObjectId,
			ref: 'Dependence'
	},
	service_type: {
			type: Schema.ObjectId,
			ref: 'ServiceType'
	},
	resource_origin: {
			type: Schema.ObjectId,
			ref: 'ResourceOrigin'
	}
});

mongoose.model('ServiceRecord', ServiceRecordSchema);