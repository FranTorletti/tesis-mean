'use strict';

//Setting up route
angular.module('resource-origins').config(['$stateProvider',
	function($stateProvider) {
		// Resource origins state routing
		$stateProvider.
		state('list-resource-origins', {
			url: '/resource-origins',
			templateUrl: 'modules/resource-origins/views/list-resource-origins.client.view.html'
		}).
		state('create-resource-origin', {
			url: '/resource-origins/create',
			templateUrl: 'modules/resource-origins/views/create-resource-origin.client.view.html'
		}).
		state('edit-resource-origin', {
			url: '/resource-origins/:resourceOriginId/edit',
			templateUrl: 'modules/resource-origins/views/edit-resource-origin.client.view.html'
		});
	}
]);