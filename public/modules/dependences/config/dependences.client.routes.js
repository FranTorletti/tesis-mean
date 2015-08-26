'use strict';

//Setting up route
angular.module('dependences').config(['$stateProvider',
	function($stateProvider) {
		// Dependences state routing
		$stateProvider.
		state('listDependences', {
			url: '/dependences',
			templateUrl: 'modules/dependences/views/list-dependences.client.view.html'
		}).
		state('createDependence', {
			url: '/dependences/create',
			templateUrl: 'modules/dependences/views/create-dependence.client.view.html'
		}).
		state('viewDependence', {
			url: '/dependences/:dependenceId',
			templateUrl: 'modules/dependences/views/view-dependence.client.view.html'
		}).
		state('editDependence', {
			url: '/dependences/:dependenceId/edit',
			templateUrl: 'modules/dependences/views/edit-dependence.client.view.html'
		});
	}
]);