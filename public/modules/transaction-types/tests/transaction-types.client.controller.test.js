'use strict';

(function() {
	// Transaction types Controller Spec
	describe('Transaction types Controller Tests', function() {
		// Initialize global variables
		var TransactionTypesController,
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

			// Initialize the Transaction types controller.
			TransactionTypesController = $controller('TransactionTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Transaction type object fetched from XHR', inject(function(TransactionTypes) {
			// Create sample Transaction type using the Transaction types service
			var sampleTransactionType = new TransactionTypes({
				name: 'New Transaction type'
			});

			// Create a sample Transaction types array that includes the new Transaction type
			var sampleTransactionTypes = [sampleTransactionType];

			// Set GET response
			$httpBackend.expectGET('transaction-types').respond(sampleTransactionTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transactionTypes).toEqualData(sampleTransactionTypes);
		}));

		it('$scope.findOne() should create an array with one Transaction type object fetched from XHR using a transactionTypeId URL parameter', inject(function(TransactionTypes) {
			// Define a sample Transaction type object
			var sampleTransactionType = new TransactionTypes({
				name: 'New Transaction type'
			});

			// Set the URL parameter
			$stateParams.transactionTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/transaction-types\/([0-9a-fA-F]{24})$/).respond(sampleTransactionType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transactionType).toEqualData(sampleTransactionType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TransactionTypes) {
			// Create a sample Transaction type object
			var sampleTransactionTypePostData = new TransactionTypes({
				name: 'New Transaction type'
			});

			// Create a sample Transaction type response
			var sampleTransactionTypeResponse = new TransactionTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Transaction type'
			});

			// Fixture mock form input values
			scope.name = 'New Transaction type';

			// Set POST response
			$httpBackend.expectPOST('transaction-types', sampleTransactionTypePostData).respond(sampleTransactionTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Transaction type was created
			expect($location.path()).toBe('/transaction-types/' + sampleTransactionTypeResponse._id);
		}));

		it('$scope.update() should update a valid Transaction type', inject(function(TransactionTypes) {
			// Define a sample Transaction type put data
			var sampleTransactionTypePutData = new TransactionTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Transaction type'
			});

			// Mock Transaction type in scope
			scope.transactionType = sampleTransactionTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/transaction-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/transaction-types/' + sampleTransactionTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid transactionTypeId and remove the Transaction type from the scope', inject(function(TransactionTypes) {
			// Create new Transaction type object
			var sampleTransactionType = new TransactionTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Transaction types array and include the Transaction type
			scope.transactionTypes = [sampleTransactionType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/transaction-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTransactionType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.transactionTypes.length).toBe(0);
		}));
	});
}());