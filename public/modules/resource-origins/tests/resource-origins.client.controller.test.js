'use strict';

(function() {
	// Resource origins Controller Spec
	describe('Resource origins Controller Tests', function() {
		// Initialize global variables
		var ResourceOriginsController,
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

			// Initialize the Resource origins controller.
			ResourceOriginsController = $controller('ResourceOriginsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Resource origin object fetched from XHR', inject(function(ResourceOrigins) {
			// Create sample Resource origin using the Resource origins service
			var sampleResourceOrigin = new ResourceOrigins({
				name: 'New Resource origin'
			});

			// Create a sample Resource origins array that includes the new Resource origin
			var sampleResourceOrigins = [sampleResourceOrigin];

			// Set GET response
			$httpBackend.expectGET('resource-origins').respond(sampleResourceOrigins);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.resourceOrigins).toEqualData(sampleResourceOrigins);
		}));

		it('$scope.findOne() should create an array with one Resource origin object fetched from XHR using a resourceOriginId URL parameter', inject(function(ResourceOrigins) {
			// Define a sample Resource origin object
			var sampleResourceOrigin = new ResourceOrigins({
				name: 'New Resource origin'
			});

			// Set the URL parameter
			$stateParams.resourceOriginId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/resource-origins\/([0-9a-fA-F]{24})$/).respond(sampleResourceOrigin);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.resourceOrigin).toEqualData(sampleResourceOrigin);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ResourceOrigins) {
			// Create a sample Resource origin object
			var sampleResourceOriginPostData = new ResourceOrigins({
				name: 'New Resource origin'
			});

			// Create a sample Resource origin response
			var sampleResourceOriginResponse = new ResourceOrigins({
				_id: '525cf20451979dea2c000001',
				name: 'New Resource origin'
			});

			// Fixture mock form input values
			scope.name = 'New Resource origin';

			// Set POST response
			$httpBackend.expectPOST('resource-origins', sampleResourceOriginPostData).respond(sampleResourceOriginResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Resource origin was created
			expect($location.path()).toBe('/resource-origins/' + sampleResourceOriginResponse._id);
		}));

		it('$scope.update() should update a valid Resource origin', inject(function(ResourceOrigins) {
			// Define a sample Resource origin put data
			var sampleResourceOriginPutData = new ResourceOrigins({
				_id: '525cf20451979dea2c000001',
				name: 'New Resource origin'
			});

			// Mock Resource origin in scope
			scope.resourceOrigin = sampleResourceOriginPutData;

			// Set PUT response
			$httpBackend.expectPUT(/resource-origins\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/resource-origins/' + sampleResourceOriginPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid resourceOriginId and remove the Resource origin from the scope', inject(function(ResourceOrigins) {
			// Create new Resource origin object
			var sampleResourceOrigin = new ResourceOrigins({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Resource origins array and include the Resource origin
			scope.resourceOrigins = [sampleResourceOrigin];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/resource-origins\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleResourceOrigin);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.resourceOrigins.length).toBe(0);
		}));
	});
}());