'use strict';

(function() {
	// Service records Controller Spec
	describe('Service records Controller Tests', function() {
		// Initialize global variables
		var ServiceRecordsController,
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

			// Initialize the Service records controller.
			ServiceRecordsController = $controller('ServiceRecordsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Service record object fetched from XHR', inject(function(ServiceRecords) {
			// Create sample Service record using the Service records service
			var sampleServiceRecord = new ServiceRecords({
				name: 'New Service record'
			});

			// Create a sample Service records array that includes the new Service record
			var sampleServiceRecords = [sampleServiceRecord];

			// Set GET response
			$httpBackend.expectGET('service-records').respond(sampleServiceRecords);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceRecords).toEqualData(sampleServiceRecords);
		}));

		it('$scope.findOne() should create an array with one Service record object fetched from XHR using a serviceRecordId URL parameter', inject(function(ServiceRecords) {
			// Define a sample Service record object
			var sampleServiceRecord = new ServiceRecords({
				name: 'New Service record'
			});

			// Set the URL parameter
			$stateParams.serviceRecordId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/service-records\/([0-9a-fA-F]{24})$/).respond(sampleServiceRecord);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceRecord).toEqualData(sampleServiceRecord);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ServiceRecords) {
			// Create a sample Service record object
			var sampleServiceRecordPostData = new ServiceRecords({
				name: 'New Service record'
			});

			// Create a sample Service record response
			var sampleServiceRecordResponse = new ServiceRecords({
				_id: '525cf20451979dea2c000001',
				name: 'New Service record'
			});

			// Fixture mock form input values
			scope.name = 'New Service record';

			// Set POST response
			$httpBackend.expectPOST('service-records', sampleServiceRecordPostData).respond(sampleServiceRecordResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Service record was created
			expect($location.path()).toBe('/service-records/' + sampleServiceRecordResponse._id);
		}));

		it('$scope.update() should update a valid Service record', inject(function(ServiceRecords) {
			// Define a sample Service record put data
			var sampleServiceRecordPutData = new ServiceRecords({
				_id: '525cf20451979dea2c000001',
				name: 'New Service record'
			});

			// Mock Service record in scope
			scope.serviceRecord = sampleServiceRecordPutData;

			// Set PUT response
			$httpBackend.expectPUT(/service-records\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/service-records/' + sampleServiceRecordPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid serviceRecordId and remove the Service record from the scope', inject(function(ServiceRecords) {
			// Create new Service record object
			var sampleServiceRecord = new ServiceRecords({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Service records array and include the Service record
			scope.serviceRecords = [sampleServiceRecord];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/service-records\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServiceRecord);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.serviceRecords.length).toBe(0);
		}));
	});
}());