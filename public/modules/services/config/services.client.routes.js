'use strict';

//Setting up route
angular.module('services').config(['$stateProvider',
	function($stateProvider) {
		// Services state routing
		$stateProvider.
		state('list-service', {
			url: '/services',
			templateUrl: 'modules/services/views/list-services.client.view.html'
		}).
		state('create-service', {
			url: '/services/create',
			templateUrl: 'modules/services/views/create-service.client.view.html'
		}).
		state('view-service', {
			url: '/services/:serviceId',
			templateUrl: 'modules/services/views/view-service.client.view.html'
		}).
		state('edit-service', {
			url: '/services/:serviceId/edit',
			templateUrl: 'modules/services/views/edit-service.client.view.html'
		});
	}
]);