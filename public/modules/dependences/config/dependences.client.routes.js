'use strict';

//Setting up route
angular.module('dependences').config(['$stateProvider',
	function($stateProvider) {
		// Dependences state routing
		$stateProvider.
		state('list-dependence', {
			url: '/dependences',
			templateUrl: 'modules/dependences/views/list-dependences.client.view.html'
		}).
		state('create-dependence', {
			url: '/dependences/create',
			templateUrl: 'modules/dependences/views/create-dependence.client.view.html'
		}).
		state('edit-dependence', {
			url: '/dependences/:dependenceId/edit',
			templateUrl: 'modules/dependences/views/edit-dependence.client.view.html'
		});
	}
]);