'use strict';

//Setting up route
angular.module('service-types').config(['$stateProvider',
	function($stateProvider) {
		// Service types state routing
		$stateProvider.
		state('list-service-ypes', {
			url: '/service-types',
			templateUrl: 'modules/service-types/views/list-service-types.client.view.html'
		}).
		state('create-service-type', {
			url: '/service-types/create',
			templateUrl: 'modules/service-types/views/create-service-type.client.view.html'
		}).
		state('edit-service-type', {
			url: '/service-types/:serviceTypeId/edit',
			templateUrl: 'modules/service-types/views/edit-service-type.client.view.html'
		});
	}
]);