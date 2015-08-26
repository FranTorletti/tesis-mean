'use strict';

//Setting up route
angular.module('transaction-types').config(['$stateProvider',
	function($stateProvider) {
		// Transaction types state routing
		$stateProvider.
		state('listTransactionTypes', {
			url: '/transaction-types',
			templateUrl: 'modules/transaction-types/views/list-transaction-types.client.view.html'
		}).
		state('createTransactionType', {
			url: '/transaction-types/create',
			templateUrl: 'modules/transaction-types/views/create-transaction-type.client.view.html'
		}).
		state('viewTransactionType', {
			url: '/transaction-types/:transactionTypeId',
			templateUrl: 'modules/transaction-types/views/view-transaction-type.client.view.html'
		}).
		state('editTransactionType', {
			url: '/transaction-types/:transactionTypeId/edit',
			templateUrl: 'modules/transaction-types/views/edit-transaction-type.client.view.html'
		});
	}
]);