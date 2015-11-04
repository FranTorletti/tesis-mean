'use strict';

// Resource origins controller
angular.module('resource-origins').controller('ResourceOriginsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ResourceOrigins',
	function($scope, $stateParams, $location, Authentication, ResourceOrigins) {
		$scope.authentication = Authentication;
		// vars
		$scope.allChecked = false;

		// Create new Resource origin
		$scope.create = function() {
			if (validForm()) {
				// Create new Resource origin object
				var resourceOrigin = new ResourceOrigins ({
					code: this.resource_origin.code,
					description: this.resource_origin.description,
					note: this.resource_origin.note
				});

				resourceOrigin.$save(function(response) {
					// Redirect after save
					$location.path('resource-origins');
					// Clear form fields
					$scope.resetForm();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Remove Resource origin selected
		$scope.removeChecked = function() {
			var foundChecked = false;
			for (var i in $scope.resourceOrigins) {
				if ($scope.resourceOrigins[i].checked) {
					//remove element
					$scope.resourceOrigins[i].$remove();
					//remove element of the list
					$scope.resourceOrigins.splice(i, 1);
					foundChecked = true;
				}
			}
		};

		// Remove existing Resource origin
		$scope.remove = function(resource_origin) {
			resource_origin.$remove();
			// remove of the list
			for (var i in $scope.resource_origins) {
				if ($scope.resource_origins[i]._id === resource_origin._id) {
					$scope.resource_origins.splice(i, 1);
				}
			}
		};

		// Update existing Resource origin
		$scope.update = function() {
			if (validForm()) {
				var resource_origin = $scope.resource_origin;

				resource_origin.$update(function() {
					$location.path('resource-origins');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Find a list of Resource origins
		$scope.find = function() {
			$scope.resource_origins = ResourceOrigins.query();
		};

		// Find existing Resource origin
		$scope.findOne = function() {
			$scope.resource_origin = ResourceOrigins.get({ 
				resourceOriginId: $stateParams.resourceOriginId
			});
		};

		// Clear form fields
		$scope.resetForm = function(){
			$scope.resource_origin.code = '';
			$scope.resource_origin.description = '';
			$scope.resource_origin.note = '';
		};

		// Check Resource origin
		$scope.checked = function(resource_origin) {
			if (typeof resource_origin.checked == "undefined" || !resource_origin.checked) {
				resource_origin.checked = true;
			} else {
				resource_origin.checked = false;
			}
		}

		// Check all Resource origin
		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.resource_origins.length - 1; i >= 0; i--) {
				$scope.resource_origins[i].checked = value;
			};
		};

		// Valid form to send
		function validForm(){
			if (!$scope.resource_origin || !$scope.resource_origin.code || $scope.resource_origin.code == '') {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.resource_origin  || !$scope.resource_origin.description || $scope.resource_origin.description == '') {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			if (!$scope.resource_origin  || !$scope.resource_origin.note || $scope.resource_origin.note == '') {
				$scope.error = 'Please set the Note. Note is empty';
				return false;
			};
			return true;
		};
	}
]);