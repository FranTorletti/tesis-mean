'use strict';

//Setting up route
angular.module('resource-origins').config(['$stateProvider',
	function($stateProvider) {
		// Resource origins state routing
		$stateProvider.
		state('listResourceOrigins', {
			url: '/resource-origins',
			templateUrl: 'modules/resource-origins/views/list-resource-origins.client.view.html'
		}).
		state('createResourceOrigin', {
			url: '/resource-origins/create',
			templateUrl: 'modules/resource-origins/views/create-resource-origin.client.view.html'
		}).
		state('viewResourceOrigin', {
			url: '/resource-origins/:resourceOriginId',
			templateUrl: 'modules/resource-origins/views/view-resource-origin.client.view.html'
		}).
		state('editResourceOrigin', {
			url: '/resource-origins/:resourceOriginId/edit',
			templateUrl: 'modules/resource-origins/views/edit-resource-origin.client.view.html'
		});
	}
]);