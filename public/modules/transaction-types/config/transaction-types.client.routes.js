'use strict';

//Setting up route
angular.module('transaction-types').config(['$stateProvider',
	function($stateProvider) {
		// Transaction types state routing
		$stateProvider.
		state('list-transaction-type', {
			url: '/transaction-types',
			templateUrl: 'modules/transaction-types/views/list-transaction-types.client.view.html'
		}).
		state('create-transaction-type', {
			url: '/transaction-types/create',
			templateUrl: 'modules/transaction-types/views/create-transaction-type.client.view.html'
		}).
		state('edit-transaction-type', {
			url: '/transaction-types/:transactionTypeId/edit',
			templateUrl: 'modules/transaction-types/views/edit-transaction-type.client.view.html'
		});
	}
]);