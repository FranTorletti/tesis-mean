'use strict';

// Service records controller
angular.module('service-records').controller('ServiceRecordsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceRecords',
	function($scope, $stateParams, $location, Authentication, ServiceRecords) {
		$scope.authentication = Authentication;

		// Create new Service record
		$scope.create = function() {
			// Create new Service record object
			var serviceRecord = new ServiceRecords ({
				name: this.name
			});

			// Redirect after save
			serviceRecord.$save(function(response) {
				$location.path('service-records/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service record
		$scope.remove = function(serviceRecord) {
			if ( serviceRecord ) { 
				serviceRecord.$remove();

				for (var i in $scope.serviceRecords) {
					if ($scope.serviceRecords [i] === serviceRecord) {
						$scope.serviceRecords.splice(i, 1);
					}
				}
			} else {
				$scope.serviceRecord.$remove(function() {
					$location.path('service-records');
				});
			}
		};

		// Update existing Service record
		$scope.update = function() {
			var serviceRecord = $scope.serviceRecord;

			serviceRecord.$update(function() {
				$location.path('service-records/' + serviceRecord._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service records
		$scope.find = function() {
			$scope.serviceRecords = ServiceRecords.query();
		};

		// Find existing Service record
		$scope.findOne = function() {
			$scope.serviceRecord = ServiceRecords.get({ 
				serviceRecordId: $stateParams.serviceRecordId
			});
		};
	}
]);