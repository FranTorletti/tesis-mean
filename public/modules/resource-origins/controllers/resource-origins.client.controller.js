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
					name: this.name,
					description: this.description,
					note: this.note
				});

				// Redirect after save
				resourceOrigin.$save(function(response) {
					$location.path('resource-origins');

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
		$scope.remove = function(resourceOrigin) {
			resourceOrigin.$remove();

			// remove of the list
			for (var i in $scope.resourceOrigins) {
				if ($scope.resourceOrigins[i]._id === resourceOrigin._id) {
					$scope.resourceOrigins.splice(i, 1);
				}
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

		// Clear form fields
		$scope.resetForm = function(){
			$scope.resource_origins.code = '';
			$scope.resource_origins.description = '';
			$scope.resource_origins.note = '';
		};

		function validForm(){
			if (!$scope.resource_origins || ($scope.resource_origins && $scope.resource_origins.code == '')) {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.resource_origins  || ($scope.resource_origins && $scope.resource_origins.description == '')) {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			if (!$scope.resource_origins  || ($scope.resource_origins && $scope.resource_origins.note == '')) {
				$scope.error = 'Please set the Note. Note is empty';
				return false;
			};
			return true;
		};
	}
]);