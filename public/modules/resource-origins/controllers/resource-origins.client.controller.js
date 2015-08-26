'use strict';

// Resource origins controller
angular.module('resource-origins').controller('ResourceOriginsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ResourceOrigins',
	function($scope, $stateParams, $location, Authentication, ResourceOrigins) {
		$scope.authentication = Authentication;

		// Create new Resource origin
		$scope.create = function() {
			// Create new Resource origin object
			var resourceOrigin = new ResourceOrigins ({
				name: this.name
			});

			// Redirect after save
			resourceOrigin.$save(function(response) {
				$location.path('resource-origins/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Resource origin
		$scope.remove = function(resourceOrigin) {
			if ( resourceOrigin ) { 
				resourceOrigin.$remove();

				for (var i in $scope.resourceOrigins) {
					if ($scope.resourceOrigins [i] === resourceOrigin) {
						$scope.resourceOrigins.splice(i, 1);
					}
				}
			} else {
				$scope.resourceOrigin.$remove(function() {
					$location.path('resource-origins');
				});
			}
		};

		// Update existing Resource origin
		$scope.update = function() {
			var resourceOrigin = $scope.resourceOrigin;

			resourceOrigin.$update(function() {
				$location.path('resource-origins/' + resourceOrigin._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Resource origins
		$scope.find = function() {
			$scope.resourceOrigins = ResourceOrigins.query();
		};

		// Find existing Resource origin
		$scope.findOne = function() {
			$scope.resourceOrigin = ResourceOrigins.get({ 
				resourceOriginId: $stateParams.resourceOriginId
			});
		};
	}
]);