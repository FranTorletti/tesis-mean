'use strict';

//Setting up route
angular.module('service-types').config(['$stateProvider',
	function($stateProvider) {
		// Service types state routing
		$stateProvider.
		state('listServiceTypes', {
			url: '/service-types',
			templateUrl: 'modules/service-types/views/list-service-types.client.view.html'
		}).
		state('createServiceType', {
			url: '/service-types/create',
			templateUrl: 'modules/service-types/views/create-service-type.client.view.html'
		}).
		state('viewServiceType', {
			url: '/service-types/:serviceTypeId',
			templateUrl: 'modules/service-types/views/view-service-type.client.view.html'
		}).
		state('editServiceType', {
			url: '/service-types/:serviceTypeId/edit',
			templateUrl: 'modules/service-types/views/edit-service-type.client.view.html'
		});
	}
]);