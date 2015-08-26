'use strict';

// Dependences controller
angular.module('dependences').controller('DependencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dependences',
	function($scope, $stateParams, $location, Authentication, Dependences) {
		$scope.authentication = Authentication;

		// Create new Dependence
		$scope.create = function() {
			// Create new Dependence object
			var dependence = new Dependences ({
				name: this.name
			});

			// Redirect after save
			dependence.$save(function(response) {
				$location.path('dependences/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dependence
		$scope.remove = function(dependence) {
			if ( dependence ) { 
				dependence.$remove();

				for (var i in $scope.dependences) {
					if ($scope.dependences [i] === dependence) {
						$scope.dependences.splice(i, 1);
					}
				}
			} else {
				$scope.dependence.$remove(function() {
					$location.path('dependences');
				});
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