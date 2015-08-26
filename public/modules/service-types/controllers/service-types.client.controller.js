'use strict';

// Service types controller
angular.module('service-types').controller('ServiceTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceTypes',
	function($scope, $stateParams, $location, Authentication, ServiceTypes) {
		$scope.authentication = Authentication;

		// Create new Service type
		$scope.create = function() {
			// Create new Service type object
			var serviceType = new ServiceTypes ({
				name: this.name
			});

			// Redirect after save
			serviceType.$save(function(response) {
				$location.path('service-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service type
		$scope.remove = function(serviceType) {
			if ( serviceType ) { 
				serviceType.$remove();

				for (var i in $scope.serviceTypes) {
					if ($scope.serviceTypes [i] === serviceType) {
						$scope.serviceTypes.splice(i, 1);
					}
				}
			} else {
				$scope.serviceType.$remove(function() {
					$location.path('service-types');
				});
			}
		};

		// Update existing Service type
		$scope.update = function() {
			var serviceType = $scope.serviceType;

			serviceType.$update(function() {
				$location.path('service-types/' + serviceType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service types
		$scope.find = function() {
			$scope.serviceTypes = ServiceTypes.query();
		};

		// Find existing Service type
		$scope.findOne = function() {
			$scope.serviceType = ServiceTypes.get({ 
				serviceTypeId: $stateParams.serviceTypeId
			});
		};
	}
]);