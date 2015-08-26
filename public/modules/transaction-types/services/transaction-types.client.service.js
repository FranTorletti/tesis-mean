'use strict';

//Transaction types service used to communicate Transaction types REST endpoints
angular.module('transaction-types').factory('TransactionTypes', ['$resource',
	function($resource) {
		return $resource('transaction-types/:transactionTypeId', { transactionTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);