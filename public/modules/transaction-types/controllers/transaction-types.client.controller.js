'use strict';

// Transaction types controller
angular.module('transaction-types').controller('TransactionTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TransactionTypes',
	function($scope, $stateParams, $location, Authentication, TransactionTypes) {
		$scope.authentication = Authentication;
		// vars
		$scope.allChecked = false;
		$scope.types = [
			{'name':'Ingress','code':'INGRESS'},
			{'name':'Egress','code':'EGRESS'}
		];
		// Create new Transaction type
		$scope.create = function() {
			if (validForm()) {
				// Create new Transaction type object
				var transactionType = new TransactionTypes ({
					name: this.transaction_type.name,
					description: this.transaction_type.description,
					type: this.transaction_type.type.code
				});
				
				transactionType.$save(function(response) {
					// Redirect after save
					$location.path('transaction-types');
					// Clear form fields
					$scope.resetForm();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Remove Transaction type selected
		$scope.removeChecked = function() {
			var foundChecked = false;
			for (var i in $scope.transactions_types) {
				if ($scope.transactions_types[i].checked) {
					//remove element
					$scope.transactions_types[i].$remove();
					//remove element of the list
					$scope.transactions_types.splice(i, 1);
					foundChecked = true;
				}
			}
		};

		// Remove existing Transaction type
		$scope.remove = function(transaction_type) {
			transaction_type.$remove();
			// remove of the list
			for (var i in $scope.dependences) {
				if ($scope.transactions_types[i]._id === transaction_type._id) {
					$scope.transactions_types.splice(i, 1);
				}
			}
		};

		// Update existing Transaction type
		$scope.update = function() {
			if (validForm()) {
				var transaction_type = $scope.transaction_type;
				transaction_type.type = $scope.transaction_type.type.code;
				transaction_type.$update(function() {
					$location.path('transaction-types');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Find a list of Transaction types
		$scope.find = function() {
			$scope.transactions_types = TransactionTypes.query();
		};

		// Find existing Transaction type
		$scope.findOne = function() {
			$scope.transaction_type = TransactionTypes.get({ 
				transactionTypeId: $stateParams.transactionTypeId
			});
			TransactionTypes.get({
				transactionTypeId: $stateParams.transactionTypeId
			},function(transaction_type){
				$scope.transaction_type = transaction_type;
				$scope.transaction_type.type = ($scope.transaction_type == 'INGRESS')? $scope.types[0] : $scope.types[1];
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});



		};

		// Clear form fields
		$scope.resetForm = function(){
			$scope.transaction_type.name = '';
			$scope.transaction_type.description = '';
			$scope.transaction_type.type = $scope.types[0];
		};

		// Check Transaction type
		$scope.checked = function(transaction_type) {
			if (typeof transaction_type.checked == "undefined" || !transaction_type.checked) {
				transaction_type.checked = true;
			} else {
				transaction_type.checked = false;
			}
		}

		// Check all Transaction type
		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.transactions_types.length - 1; i >= 0; i--) {
				$scope.transactions_types[i].checked = value;
			};
		};

		// Valid form to send
		function validForm(){
			if (!$scope.transaction_type || !$scope.transaction_type.name || $scope.transaction_type.name == '') {
				$scope.error = 'Please set the name. Name is empty';
				return false;
			};
			if (!$scope.transaction_type  || !$scope.transaction_type.description || $scope.transaction_type.description == '') {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			return true;
		};
	}
]);