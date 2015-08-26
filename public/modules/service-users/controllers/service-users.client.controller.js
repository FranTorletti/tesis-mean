'use strict';

// Service users controller
angular.module('service-users').controller('ServiceUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceUsers',
	function($scope, $stateParams, $location, Authentication, ServiceUsers) {
		$scope.authentication = Authentication;

		// Create new Service user
		$scope.create = function() {
			// Create new Service user object
			var serviceUser = new ServiceUsers ({
				name: this.name
			});

			// Redirect after save
			serviceUser.$save(function(response) {
				$location.path('service-users/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service user
		$scope.remove = function(serviceUser) {
			if ( serviceUser ) { 
				serviceUser.$remove();

				for (var i in $scope.serviceUsers) {
					if ($scope.serviceUsers [i] === serviceUser) {
						$scope.serviceUsers.splice(i, 1);
					}
				}
			} else {
				$scope.serviceUser.$remove(function() {
					$location.path('service-users');
				});
			}
		};

		// Update existing Service user
		$scope.update = function() {
			var serviceUser = $scope.serviceUser;

			serviceUser.$update(function() {
				$location.path('service-users/' + serviceUser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service users
		$scope.find = function() {
			$scope.serviceUsers = ServiceUsers.query();
		};

		// Find existing Service user
		$scope.findOne = function() {
			$scope.serviceUser = ServiceUsers.get({ 
				serviceUserId: $stateParams.serviceUserId
			});
		};
	}
]);