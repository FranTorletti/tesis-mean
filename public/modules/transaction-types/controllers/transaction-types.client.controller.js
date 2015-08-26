'use strict';

// Transaction types controller
angular.module('transaction-types').controller('TransactionTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TransactionTypes',
	function($scope, $stateParams, $location, Authentication, TransactionTypes) {
		$scope.authentication = Authentication;

		// Create new Transaction type
		$scope.create = function() {
			// Create new Transaction type object
			var transactionType = new TransactionTypes ({
				name: this.name
			});

			// Redirect after save
			transactionType.$save(function(response) {
				$location.path('transaction-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Transaction type
		$scope.remove = function(transactionType) {
			if ( transactionType ) { 
				transactionType.$remove();

				for (var i in $scope.transactionTypes) {
					if ($scope.transactionTypes [i] === transactionType) {
						$scope.transactionTypes.splice(i, 1);
					}
				}
			} else {
				$scope.transactionType.$remove(function() {
					$location.path('transaction-types');
				});
			}
		};

		// Update existing Transaction type
		$scope.update = function() {
			var transactionType = $scope.transactionType;

			transactionType.$update(function() {
				$location.path('transaction-types/' + transactionType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Transaction types
		$scope.find = function() {
			$scope.transactionTypes = TransactionTypes.query();
		};

		// Find existing Transaction type
		$scope.findOne = function() {
			$scope.transactionType = TransactionTypes.get({ 
				transactionTypeId: $stateParams.transactionTypeId
			});
		};
	}
]);