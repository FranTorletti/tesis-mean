'use strict';

// Dependences controller
angular.module('dependences').controller('DependencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dependences',
	function($scope, $stateParams, $location, Authentication, Dependences) {
		$scope.authentication = Authentication;
		// vars
		$scope.allChecked = false;

		// Create new Dependence
		$scope.create = function() {
			if (validForm()) {
				// Create new Dependence object
				var dependence = new Dependences ({
					code: this.dependence.code,
					description: this.dependence.description
				});

				dependence.$save(function(response) {
					// Redirect after save
					$location.path('dependences');
					// Clear form fields
					$scope.resetForm();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Remove Dependences selected
		$scope.removeChecked = function() {
			var foundChecked = false;
			for (var i in $scope.dependences) {
				if ($scope.dependences[i].checked) {
					//remove element
					$scope.dependences[i].$remove();
					//remove element of the list
					$scope.dependences.splice(i, 1);
					foundChecked = true;
				}
			}
		};

		// Remove existing Dependence
		$scope.remove = function(dependence) {
			dependence.$remove();
			// remove of the list
			for (var i in $scope.dependences) {
				if ($scope.dependences[i]._id === dependence._id) {
					$scope.dependences.splice(i, 1);
				}
			}
		};

		// Update existing Dependence
		$scope.update = function() {
			if (validForm()) {
				var dependence = $scope.dependence;

				dependence.$update(function() {
					$location.path('dependences');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Find a list of Dependences
		$scope.find = function() {
			$scope.dependences = Dependences.query();
		};

		// Find existing Dependence
		$scope.findOne = function() {
			$scope.dependence = Dependences.get({ 
				dependenceId: $stateParams.dependenceId
			});
		};

		// Clear form fields
		$scope.resetForm = function(){
			$scope.dependence.code = '';
			$scope.dependence.description = '';
		};

		// Check dependence
		$scope.checked = function(dependence) {
			if (typeof dependence.checked == "undefined" || !dependence.checked) {
				dependence.checked = true;
			} else {
				dependence.checked = false;
			}
		}

		// Check all dependence
		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.dependences.length - 1; i >= 0; i--) {
				$scope.dependences[i].checked = value;
			};
		};

		// Valid form to send
		function validForm(){
			if (!$scope.dependence || !$scope.dependence.description || $scope.dependence.code == '') {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.dependence  || !$scope.dependence.description || $scope.dependence.description == '') {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			return true;
		};
	}
]);