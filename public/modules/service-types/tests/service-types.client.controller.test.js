'use strict';

(function() {
	// Service types Controller Spec
	describe('Service types Controller Tests', function() {
		// Initialize global variables
		var ServiceTypesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Service types controller.
			ServiceTypesController = $controller('ServiceTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Service type object fetched from XHR', inject(function(ServiceTypes) {
			// Create sample Service type using the Service types service
			var sampleServiceType = new ServiceTypes({
				name: 'New Service type'
			});

			// Create a sample Service types array that includes the new Service type
			var sampleServiceTypes = [sampleServiceType];

			// Set GET response
			$httpBackend.expectGET('service-types').respond(sampleServiceTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceTypes).toEqualData(sampleServiceTypes);
		}));

		it('$scope.findOne() should create an array with one Service type object fetched from XHR using a serviceTypeId URL parameter', inject(function(ServiceTypes) {
			// Define a sample Service type object
			var sampleServiceType = new ServiceTypes({
				name: 'New Service type'
			});

			// Set the URL parameter
			$stateParams.serviceTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/service-types\/([0-9a-fA-F]{24})$/).respond(sampleServiceType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceType).toEqualData(sampleServiceType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ServiceTypes) {
			// Create a sample Service type object
			var sampleServiceTypePostData = new ServiceTypes({
				name: 'New Service type'
			});

			// Create a sample Service type response
			var sampleServiceTypeResponse = new ServiceTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Service type'
			});

			// Fixture mock form input values
			scope.name = 'New Service type';

			// Set POST response
			$httpBackend.expectPOST('service-types', sampleServiceTypePostData).respond(sampleServiceTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Service type was created
			expect($location.path()).toBe('/service-types/' + sampleServiceTypeResponse._id);
		}));

		it('$scope.update() should update a valid Service type', inject(function(ServiceTypes) {
			// Define a sample Service type put data
			var sampleServiceTypePutData = new ServiceTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Service type'
			});

			// Mock Service type in scope
			scope.serviceType = sampleServiceTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/service-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/service-types/' + sampleServiceTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid serviceTypeId and remove the Service type from the scope', inject(function(ServiceTypes) {
			// Create new Service type object
			var sampleServiceType = new ServiceTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Service types array and include the Service type
			scope.serviceTypes = [sampleServiceType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/service-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServiceType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.serviceTypes.length).toBe(0);
		}));
	});
}());