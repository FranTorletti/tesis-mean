'use strict';

// Services controller
angular.module('services').controller('ServicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Services', 'Dependences', 'ServiceTypes', 'ResourceOrigins', 'Users',
	function($scope, $stateParams, $location, Authentication, Services, Dependences, ServiceTypes, ResourceOrigins, Users) {
		$scope.authentication = Authentication;
		// vars
		$scope.allChecked = false;

		// Create new Service
		$scope.create = function() {
			if (validForm()) {
				// Create new Service object
				var service = new Services ({
					code: this.service.code,
					name: this.service.name,
					description: this.service.description,
					dependence: this.service.dependence,
					service_type: this.service.service_type,
					resource_origin: this.service.resource_origin
				});

				service.$save(function(response) {
					// Redirect after save
					$location.path('services');
					// Clear form fields
					$scope.resetForm();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Remove Service selected
		$scope.removeChecked = function() {
			var foundChecked = false;
			for (var i in $scope.services) {
				if ($scope.services[i].checked) {
					//remove element
					$scope.services[i].$remove();
					//remove element of the list
					$scope.services.splice(i, 1);
					foundChecked = true;
				}
			}
		};

		// Remove existing Service
		$scope.remove = function(service) {
			service.$remove();
			for (var i in $scope.services) {
				if ($scope.services[i]._id === service._id) {
					$scope.services.splice(i, 1);
				}
			}
		};

		// Update existing Service
		$scope.update = function() {
			if (validForm()) {
				var service = $scope.service;

				service.$update(function() {
					$location.path('services');
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		};

		// Find a list of Services
		$scope.find = function() {
			$scope.services = Services.query();
		};

		// Find a list of Dependences
		$scope.findDependences = function() {
			$scope.dependences = Dependences.query();
		};

		// Find a list of Service Types
		$scope.findServiceTypes = function() {
			$scope.service_types = ServiceTypes.query();
		};

		// Find a list of Resource Origins
		$scope.findResourceOrigins = function() {
			$scope.resource_origins = ResourceOrigins.query();
		};

		// Find a list of users responsibles
		$scope.findResponsibles = function() {
			$scope.responsibles = Users.getResponsibles();
		};

		// Find information requere for create and update a service
		$scope.preData = function() {
			$scope.findDependences();
			$scope.findServiceTypes();
			$scope.findResourceOrigins();
			$scope.findResponsibles();
		};

		// Find existing Service
		$scope.findOne = function() {
			$scope.service = Services.get({ 
				serviceId: $stateParams.serviceId
			});
		};

		// Clear form fields
		$scope.resetForm = function(){
			$scope.service.code = '';
			$scope.service.name = '';
			$scope.service.description = '';
			$scope.service.dependence = null;
			$scope.service.service_type = null;
			$scope.service.resource_origin = null;
		};

		// Check Service
		$scope.checked = function(service) {
			if (typeof service.checked == "undefined" || !service.checked) {
				service.checked = true;
			} else {
				service.checked = false;
			}
		}

		// Check all Service
		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.services.length - 1; i >= 0; i--) {
				$scope.services[i].checked = value;
			};
		};

		// Valid form to send
		function validForm(){
			if (!$scope.service  || !$scope.service.name || $scope.service.name == '') {
				$scope.error = 'Please set the name. Name is empty';
				return false;
			};
			if (!$scope.service  || !$scope.service.description || $scope.service.description == '') {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			if (!$scope.service  || !$scope.service.dependence || $scope.service.dependence == '') {
				$scope.error = 'Please set the dependence. Dependence is empty';
				return false;
			};
			if (!$scope.service  || !$scope.service.service_type || $scope.service.service_type == '') {
				$scope.error = 'Please set the service type. Service type is empty';
				return false;
			};
			if (!$scope.service  || !$scope.service.resource_origin || $scope.service.resource_origin == '') {
				$scope.error = 'Please set the resource origin. Resource_origin is empty';
				return false;
			};
			return true;
		};
	}
]);