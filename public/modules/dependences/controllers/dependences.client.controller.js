'use strict';

// Dependences controller
angular.module('dependences').controller('DependencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dependences',
	function($scope, $stateParams, $location, Authentication, Dependences) {
		$scope.authentication = Authentication;
		$scope.allChecked = false;
		// Create new Dependence
		$scope.create = function() {
			if (validForm()) {
				// Create new Dependence object
				var dependence = new Dependences ({
					code: this.dependence.code,
					description: this.dependence.description
				});

				// Redirect after save
				dependence.$save(function(response) {
					$location.path('dependences');

					// Clear form fields
					$scope.code = '';
					$scope.description = '';
				}, function(errorResponse) {
					console.log('errorResponse: ',errorResponse);
					$scope.error = errorResponse.data.message;
				});
			};
		};

		$scope.resetForm = function(){
			// Clear form fields
			$scope.dependence.code = '';
			$scope.dependence.description = '';
		};

		function validForm(){
			if (!$scope.dependence || ($scope.dependence && $scope.dependence.code == '')) {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.dependence  || ($scope.dependence && $scope.dependence.description == '')) {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			return true;
		};

		$scope.checked = function(dependence) {
			if (typeof dependence.checked == "undefined" || !dependence.checked) {
				dependence.checked = true;
			} else {
				dependence.checked = false;
			}
		}

		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.dependences.length - 1; i >= 0; i--) {
				$scope.dependences[i].checked = value;
			};
		};

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
			console.log('found checked: ',foundChecked);
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
			var dependence = $scope.dependence;

			dependence.$update(function() {
				$location.path('dependences/' + dependence._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
	}
]);