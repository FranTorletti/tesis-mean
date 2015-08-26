'use strict';

(function() {
	// Service users Controller Spec
	describe('Service users Controller Tests', function() {
		// Initialize global variables
		var ServiceUsersController,
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

			// Initialize the Service users controller.
			ServiceUsersController = $controller('ServiceUsersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Service user object fetched from XHR', inject(function(ServiceUsers) {
			// Create sample Service user using the Service users service
			var sampleServiceUser = new ServiceUsers({
				name: 'New Service user'
			});

			// Create a sample Service users array that includes the new Service user
			var sampleServiceUsers = [sampleServiceUser];

			// Set GET response
			$httpBackend.expectGET('service-users').respond(sampleServiceUsers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceUsers).toEqualData(sampleServiceUsers);
		}));

		it('$scope.findOne() should create an array with one Service user object fetched from XHR using a serviceUserId URL parameter', inject(function(ServiceUsers) {
			// Define a sample Service user object
			var sampleServiceUser = new ServiceUsers({
				name: 'New Service user'
			});

			// Set the URL parameter
			$stateParams.serviceUserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/service-users\/([0-9a-fA-F]{24})$/).respond(sampleServiceUser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceUser).toEqualData(sampleServiceUser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ServiceUsers) {
			// Create a sample Service user object
			var sampleServiceUserPostData = new ServiceUsers({
				name: 'New Service user'
			});

			// Create a sample Service user response
			var sampleServiceUserResponse = new ServiceUsers({
				_id: '525cf20451979dea2c000001',
				name: 'New Service user'
			});

			// Fixture mock form input values
			scope.name = 'New Service user';

			// Set POST response
			$httpBackend.expectPOST('service-users', sampleServiceUserPostData).respond(sampleServiceUserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Service user was created
			expect($location.path()).toBe('/service-users/' + sampleServiceUserResponse._id);
		}));

		it('$scope.update() should update a valid Service user', inject(function(ServiceUsers) {
			// Define a sample Service user put data
			var sampleServiceUserPutData = new ServiceUsers({
				_id: '525cf20451979dea2c000001',
				name: 'New Service user'
			});

			// Mock Service user in scope
			scope.serviceUser = sampleServiceUserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/service-users\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/service-users/' + sampleServiceUserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid serviceUserId and remove the Service user from the scope', inject(function(ServiceUsers) {
			// Create new Service user object
			var sampleServiceUser = new ServiceUsers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Service users array and include the Service user
			scope.serviceUsers = [sampleServiceUser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/service-users\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServiceUser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.serviceUsers.length).toBe(0);
		}));
	});
}());