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
			for (var i in $scope.types_services) {
				if ($scope.types_services[i].checked) {
					//remove element
					$scope.types_services[i].$remove();
					//remove element of the list
					$scope.types_services.splice(i, 1);
					foundChecked = true;
				}
			}
		};

		// Remove existing Service type
		$scope.remove = function(type_service) {
			type_service.$remove();
			// remove of the list
			for (var i in $scope.types_services) {
				if ($scope.types_services[i]._id === type_service._id) {
					$scope.types_services.splice(i, 1);
				}
			}
		};

		// Update existing Service type
		$scope.update = function() {
			if (validForm()) {
				var type_service = $scope.type_service;

				type_service.$update(function() {
					$location.path('service-types');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Find a list of Service type
		$scope.find = function() {
			$scope.types_services = ServiceTypes.query();
		};

		// Find existing Service type
		$scope.findOne = function() {
			$scope.type_service = ServiceTypes.get({ 
				serviceTypeId: $stateParams.serviceTypeId
			});
		};

		// Clear form fields
		$scope.resetForm = function(){
			$scope.type_service.code = '';
			$scope.type_service.description = '';
			$scope.type_service.note = '';
			$scope.type_service.retention_of_faculty = 0;
			$scope.type_service.retention_of_university = 0;
		};

		// Check Service type
		$scope.checked = function(type_service) {
			if (typeof type_service.checked == "undefined" || !type_service.checked) {
				type_service.checked = true;
			} else {
				type_service.checked = false;
			}
		}

		// Check all Service type
		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.types_services.length - 1; i >= 0; i--) {
				$scope.types_services[i].checked = value;
			};
		};

		// Valid form to send
		function validForm(){
			if (!$scope.type_service || !$scope.type_service.description || $scope.type_service.code == '') {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.type_service  || !$scope.type_service.description || $scope.type_service.description == '') {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			if (!$scope.type_service  || !$scope.type_service.note || $scope.type_service.note == '') {
				$scope.error = 'Please set the note. Note is empty';
				return false;
			};
			if (!$scope.type_service  || !$scope.type_service.retention_of_faculty || $scope.type_service.retention_of_faculty == '') {
				$scope.error = 'Please set the retention of faculty. Retention of faculty is empty';
				return false;
			};
			if (!$scope.type_service  || !$scope.type_service.retention_of_university || $scope.type_service.retention_of_university == '') {
				$scope.error = 'Please set the retention of university. Retention of university is empty';
				return false;
			};
			return true;
		};
	}
]);