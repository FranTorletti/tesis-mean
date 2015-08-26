'use strict';

//Setting up route
angular.module('service-users').config(['$stateProvider',
	function($stateProvider) {
		// Service users state routing
		$stateProvider.
		state('listServiceUsers', {
			url: '/service-users',
			templateUrl: 'modules/service-users/views/list-service-users.client.view.html'
		}).
		state('createServiceUser', {
			url: '/service-users/create',
			templateUrl: 'modules/service-users/views/create-service-user.client.view.html'
		}).
		state('viewServiceUser', {
			url: '/service-users/:serviceUserId',
			templateUrl: 'modules/service-users/views/view-service-user.client.view.html'
		}).
		state('editServiceUser', {
			url: '/service-users/:serviceUserId/edit',
			templateUrl: 'modules/service-users/views/edit-service-user.client.view.html'
		});
	}
]);