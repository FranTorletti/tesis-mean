'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service Schema
 */
var ServiceSchema = new Schema({
	code: {
		type: String,
		default: '',
		required: 'Please fill Service code',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Service name'
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Service description'
	},
	status : {
		type: String,
		trim:true,
		default: 'WAITING',
		enum: ['WAITING','DISCART','ACCEPTED','COMPLETED','CANCELLED']
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
	},
	services_user: [{
				type: Schema.ObjectId,
				ref: 'ServiceUser'
	}]
});

mongoose.model('Service', ServiceSchema);