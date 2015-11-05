'use strict';

// Service types controller
angular.module('service-types').controller('ServiceTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceTypes',
	function($scope, $stateParams, $location, Authentication, ServiceTypes) {
		$scope.authentication = Authentication;
		// vars
		$scope.allChecked = false;

		// Create new Service type
		$scope.create = function() {
			if (validForm()) {
				// Create new Service type object
				var service_type = new ServiceTypes ({
					code: this.service_type.code,
					description: this.service_type.description,
					note: this.service_type.note,
					retention_of_faculty: this.service_type.retention_of_faculty,
					retention_of_university: this.service_type.retention_of_university,
				});

				service_type.$save(function(response) {
					// Redirect after save
					$location.path('service-types');
					// Clear form fields
					$scope.resetForm();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Remove Service type selected
		$scope.removeChecked = function() {
			var foundChecked = false;
			for (var i in $scope.services_types) {
				if ($scope.services_types[i].checked) {
					//remove element
					$scope.services_types[i].$remove();
					//remove element of the list
					$scope.services_types.splice(i, 1);
					foundChecked = true;
				}
			}
		};

		// Remove existing Service type
		$scope.remove = function(service_type) {
			service_type.$remove();
			// remove of the list
			for (var i in $scope.services_types) {
				if ($scope.services_types[i]._id === service_type._id) {
					$scope.services_types.splice(i, 1);
				}
			}
		};

		// Update existing Service type
		$scope.update = function() {
			if (validForm()) {
				var service_type = $scope.service_type;

				service_type.$update(function() {
					$location.path('service-types');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Find a list of Service type
		$scope.find = function() {
			$scope.services_types = ServiceTypes.query();
		};

		// Find existing Service type
		$scope.findOne = function() {
			$scope.service_type = ServiceTypes.get({ 
				serviceTypeId: $stateParams.serviceTypeId
			});
		};

		// Clear form fields
		$scope.resetForm = function(){
			$scope.service_type.code = '';
			$scope.service_type.description = '';
			$scope.service_type.note = '';
			$scope.service_type.retention_of_faculty = 0;
			$scope.service_type.retention_of_university = 0;
		};

		// Check Service type
		$scope.checked = function(service_type) {
			if (typeof service_type.checked == "undefined" || !service_type.checked) {
				service_type.checked = true;
			} else {
				service_type.checked = false;
			}
		}

		// Check all Service type
		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.services_types.length - 1; i >= 0; i--) {
				$scope.services_types[i].checked = value;
			};
		};

		// Valid form to send
		function validForm(){
			if (!$scope.service_type || !$scope.service_type.code || $scope.service_type.code == '') {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.service_type  || !$scope.service_type.description || $scope.service_type.description == '') {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			if (!$scope.service_type  || !$scope.service_type.note || $scope.service_type.note == '') {
				$scope.error = 'Please set the note. Note is empty';
				return false;
			};
			if (!$scope.service_type  || typeof $scope.service_type.retention_of_faculty == 'undefined') {
				$scope.error = 'Please set the retention of faculty. Retention of faculty is empty';
				return false;
			};

			if ($scope.service_type.retention_of_faculty < 0 || $scope.service_type.retention_of_faculty > 100) {
				$scope.error = 'Please reset the retention of faculty. Retention of faculty must be greater than 0 and less than 100';
				return false;	
			};
			if (!$scope.service_type  || typeof $scope.service_type.retention_of_university == 'undefined') {
				$scope.error = 'Please set the retention of university. Retention of university is empty';
				return false;
			};
			if ($scope.service_type.retention_of_university < 0 || $scope.service_type.retention_of_university > 100) {
				$scope.error = 'Please reset the retention of university. Retention of university must be greater than 0 and less than 100';
				return false;	
			};
			return true;
		};
	}
]);