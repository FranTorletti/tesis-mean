'use strict';

(function() {
	// Dependences Controller Spec
	describe('Dependences Controller Tests', function() {
		// Initialize global variables
		var DependencesController,
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

			// Initialize the Dependences controller.
			DependencesController = $controller('DependencesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dependence object fetched from XHR', inject(function(Dependences) {
			// Create sample Dependence using the Dependences service
			var sampleDependence = new Dependences({
				name: 'New Dependence'
			});

			// Create a sample Dependences array that includes the new Dependence
			var sampleDependences = [sampleDependence];

			// Set GET response
			$httpBackend.expectGET('dependences').respond(sampleDependences);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependences).toEqualData(sampleDependences);
		}));

		it('$scope.findOne() should create an array with one Dependence object fetched from XHR using a dependenceId URL parameter', inject(function(Dependences) {
			// Define a sample Dependence object
			var sampleDependence = new Dependences({
				name: 'New Dependence'
			});

			// Set the URL parameter
			$stateParams.dependenceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dependences\/([0-9a-fA-F]{24})$/).respond(sampleDependence);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependence).toEqualData(sampleDependence);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dependences) {
			// Create a sample Dependence object
			var sampleDependencePostData = new Dependences({
				name: 'New Dependence'
			});

			// Create a sample Dependence response
			var sampleDependenceResponse = new Dependences({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependence'
			});

			// Fixture mock form input values
			scope.name = 'New Dependence';

			// Set POST response
			$httpBackend.expectPOST('dependences', sampleDependencePostData).respond(sampleDependenceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dependence was created
			expect($location.path()).toBe('/dependences/' + sampleDependenceResponse._id);
		}));

		it('$scope.update() should update a valid Dependence', inject(function(Dependences) {
			// Define a sample Dependence put data
			var sampleDependencePutData = new Dependences({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependence'
			});

			// Mock Dependence in scope
			scope.dependence = sampleDependencePutData;

			// Set PUT response
			$httpBackend.expectPUT(/dependences\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dependences/' + sampleDependencePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dependenceId and remove the Dependence from the scope', inject(function(Dependences) {
			// Create new Dependence object
			var sampleDependence = new Dependences({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dependences array and include the Dependence
			scope.dependences = [sampleDependence];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dependences\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDependence);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dependences.length).toBe(0);
		}));
	});
}());