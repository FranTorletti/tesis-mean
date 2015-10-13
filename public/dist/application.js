'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'tesis-mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dependences');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('resource-origins');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('service-records');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('service-types');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('service-users');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('services');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('transaction-types');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('transactions');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
		*/
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		//$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('dependences').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('dependences', 'Dependences', 'dependences', 'dropdown', '/dependences(/create)?');
		Menus.addSubMenuItem('dependences', 'dependences', 'List Dependences', 'dependences');
		Menus.addSubMenuItem('dependences', 'dependences', 'New Dependence', 'dependences/create');
		*/
	}
]);
'use strict';

//Setting up route
angular.module('dependences').config(['$stateProvider',
	function($stateProvider) {
		// Dependences state routing
		$stateProvider.
		state('listDependences', {
			url: '/dependences',
			templateUrl: 'modules/dependences/views/list-dependences.client.view.html'
		}).
		state('createDependence', {
			url: '/dependences/create',
			templateUrl: 'modules/dependences/views/create-dependence.client.view.html'
		}).
		state('viewDependence', {
			url: '/dependences/:dependenceId',
			templateUrl: 'modules/dependences/views/view-dependence.client.view.html'
		}).
		state('editDependence', {
			url: '/dependences/:dependenceId/edit',
			templateUrl: 'modules/dependences/views/edit-dependence.client.view.html'
		});
	}
]);
'use strict';

// Dependences controller
angular.module('dependences').controller('DependencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dependences',
	function($scope, $stateParams, $location, Authentication, Dependences) {
		$scope.authentication = Authentication;
		$scope.allChecked = false;
		// Create new Dependence
		$scope.create = function() {
			if (validForm()) {
				// Create new Dependence object
				var dependence = new Dependences ({
					code: this.dependence.code,
					description: this.dependence.description
				});

				// Redirect after save
				dependence.$save(function(response) {
					$location.path('dependences');

					// Clear form fields
					$scope.code = '';
					$scope.description = '';
				}, function(errorResponse) {
					console.log('errorResponse: ',errorResponse);
					$scope.error = errorResponse.data.message;
				});
			};
		};

		$scope.resetForm = function(){
			// Clear form fields
			$scope.dependence.code = '';
			$scope.dependence.description = '';
		};

		function validForm(){
			if (!$scope.dependence || ($scope.dependence && $scope.dependence.code == '')) {
				$scope.error = 'Please set the code. Code is empty';
				return false;
			};
			if (!$scope.dependence  || ($scope.dependence && $scope.dependence.description == '')) {
				$scope.error = 'Please set the description. Description is empty';
				return false;
			};
			return true;
		};

		$scope.checked = function(dependence) {
			if (typeof dependence.checked == "undefined" || !dependence.checked) {
				dependence.checked = true;
			} else {
				dependence.checked = false;
			}
		}

		$scope.checkAll = function() {
			var value = !$scope.allChecked; 
			//change value checked
			for (var i = $scope.dependences.length - 1; i >= 0; i--) {
				$scope.dependences[i].checked = value;
			};
		};

		$scope.removeChecked = function() {
			var foundChecked = false;
			for (var i in $scope.dependences) {
				if ($scope.dependences[i].checked) {
					//remove element
					$scope.dependences[i].$remove();
					//remove element of the list
					$scope.dependences.splice(i, 1);
					foundChecked = true;
				}
			}
			console.log('found checked: ',foundChecked);
		};

		// Remove existing Dependence
		$scope.remove = function(dependence) {
			dependence.$remove();
			// remove of the list
			for (var i in $scope.dependences) {
				if ($scope.dependences[i]._id === dependence._id) {
					$scope.dependences.splice(i, 1);
				}
			}
		};

		// Update existing Dependence
		$scope.update = function() {
			var dependence = $scope.dependence;

			dependence.$update(function() {
				$location.path('dependences/' + dependence._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dependences
		$scope.find = function() {
			$scope.dependences = Dependences.query();
		};

		// Find existing Dependence
		$scope.findOne = function() {
			$scope.dependence = Dependences.get({ 
				dependenceId: $stateParams.dependenceId
			});
		};
	}
]);
'use strict';

//Dependences service used to communicate Dependences REST endpoints
angular.module('dependences').factory('Dependences', ['$resource',
	function($resource) {
		return $resource('dependences/:dependenceId', { dependenceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('resource-origins').config(['$stateProvider',
	function($stateProvider) {
		// Resource origins state routing
		$stateProvider.
		state('listResourceOrigins', {
			url: '/resource-origins',
			templateUrl: 'modules/resource-origins/views/list-resource-origins.client.view.html'
		}).
		state('createResourceOrigin', {
			url: '/resource-origins/create',
			templateUrl: 'modules/resource-origins/views/create-resource-origin.client.view.html'
		}).
		state('viewResourceOrigin', {
			url: '/resource-origins/:resourceOriginId',
			templateUrl: 'modules/resource-origins/views/view-resource-origin.client.view.html'
		}).
		state('editResourceOrigin', {
			url: '/resource-origins/:resourceOriginId/edit',
			templateUrl: 'modules/resource-origins/views/edit-resource-origin.client.view.html'
		});
	}
]);
'use strict';

// Resource origins controller
angular.module('resource-origins').controller('ResourceOriginsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ResourceOrigins',
	function($scope, $stateParams, $location, Authentication, ResourceOrigins) {
		$scope.authentication = Authentication;

		// Create new Resource origin
		$scope.create = function() {
			// Create new Resource origin object
			var resourceOrigin = new ResourceOrigins ({
				name: this.name
			});

			// Redirect after save
			resourceOrigin.$save(function(response) {
				$location.path('resource-origins/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Resource origin
		$scope.remove = function(resourceOrigin) {
			if ( resourceOrigin ) { 
				resourceOrigin.$remove();

				for (var i in $scope.resourceOrigins) {
					if ($scope.resourceOrigins [i] === resourceOrigin) {
						$scope.resourceOrigins.splice(i, 1);
					}
				}
			} else {
				$scope.resourceOrigin.$remove(function() {
					$location.path('resource-origins');
				});
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
	}
]);
'use strict';

//Resource origins service used to communicate Resource origins REST endpoints
angular.module('resource-origins').factory('ResourceOrigins', ['$resource',
	function($resource) {
		return $resource('resource-origins/:resourceOriginId', { resourceOriginId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('service-records').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('service-records', 'Service records', 'service-records', 'dropdown', '/service-records(/create)?');
		Menus.addSubMenuItem('service-records', 'service-records', 'List Service records', 'service-records');
		Menus.addSubMenuItem('service-records', 'service-records', 'New Service record', 'service-records/create');
		*/
	}
]);
'use strict';

//Setting up route
angular.module('service-records').config(['$stateProvider',
	function($stateProvider) {
		// Service records state routing
		$stateProvider.
		state('listServiceRecords', {
			url: '/service-records',
			templateUrl: 'modules/service-records/views/list-service-records.client.view.html'
		}).
		state('createServiceRecord', {
			url: '/service-records/create',
			templateUrl: 'modules/service-records/views/create-service-record.client.view.html'
		}).
		state('viewServiceRecord', {
			url: '/service-records/:serviceRecordId',
			templateUrl: 'modules/service-records/views/view-service-record.client.view.html'
		}).
		state('editServiceRecord', {
			url: '/service-records/:serviceRecordId/edit',
			templateUrl: 'modules/service-records/views/edit-service-record.client.view.html'
		});
	}
]);
'use strict';

// Service records controller
angular.module('service-records').controller('ServiceRecordsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceRecords',
	function($scope, $stateParams, $location, Authentication, ServiceRecords) {
		$scope.authentication = Authentication;

		// Create new Service record
		$scope.create = function() {
			// Create new Service record object
			var serviceRecord = new ServiceRecords ({
				name: this.name
			});

			// Redirect after save
			serviceRecord.$save(function(response) {
				$location.path('service-records/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service record
		$scope.remove = function(serviceRecord) {
			if ( serviceRecord ) { 
				serviceRecord.$remove();

				for (var i in $scope.serviceRecords) {
					if ($scope.serviceRecords [i] === serviceRecord) {
						$scope.serviceRecords.splice(i, 1);
					}
				}
			} else {
				$scope.serviceRecord.$remove(function() {
					$location.path('service-records');
				});
			}
		};

		// Update existing Service record
		$scope.update = function() {
			var serviceRecord = $scope.serviceRecord;

			serviceRecord.$update(function() {
				$location.path('service-records/' + serviceRecord._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service records
		$scope.find = function() {
			$scope.serviceRecords = ServiceRecords.query();
		};

		// Find existing Service record
		$scope.findOne = function() {
			$scope.serviceRecord = ServiceRecords.get({ 
				serviceRecordId: $stateParams.serviceRecordId
			});
		};
	}
]);
'use strict';

//Service records service used to communicate Service records REST endpoints
angular.module('service-records').factory('ServiceRecords', ['$resource',
	function($resource) {
		return $resource('service-records/:serviceRecordId', { serviceRecordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('service-types').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('service-types', 'Service types', 'service-types', 'dropdown', '/service-types(/create)?');
		Menus.addSubMenuItem('service-types', 'service-types', 'List Service types', 'service-types');
		Menus.addSubMenuItem('service-types', 'service-types', 'New Service type', 'service-types/create');
		*/
	}
]);
'use strict';

//Setting up route
angular.module('service-types').config(['$stateProvider',
	function($stateProvider) {
		// Service types state routing
		$stateProvider.
		state('listServiceTypes', {
			url: '/service-types',
			templateUrl: 'modules/service-types/views/list-service-types.client.view.html'
		}).
		state('createServiceType', {
			url: '/service-types/create',
			templateUrl: 'modules/service-types/views/create-service-type.client.view.html'
		}).
		state('viewServiceType', {
			url: '/service-types/:serviceTypeId',
			templateUrl: 'modules/service-types/views/view-service-type.client.view.html'
		}).
		state('editServiceType', {
			url: '/service-types/:serviceTypeId/edit',
			templateUrl: 'modules/service-types/views/edit-service-type.client.view.html'
		});
	}
]);
'use strict';

// Service types controller
angular.module('service-types').controller('ServiceTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceTypes',
	function($scope, $stateParams, $location, Authentication, ServiceTypes) {
		$scope.authentication = Authentication;

		// Create new Service type
		$scope.create = function() {
			// Create new Service type object
			var serviceType = new ServiceTypes ({
				name: this.name
			});

			// Redirect after save
			serviceType.$save(function(response) {
				$location.path('service-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service type
		$scope.remove = function(serviceType) {
			if ( serviceType ) { 
				serviceType.$remove();

				for (var i in $scope.serviceTypes) {
					if ($scope.serviceTypes [i] === serviceType) {
						$scope.serviceTypes.splice(i, 1);
					}
				}
			} else {
				$scope.serviceType.$remove(function() {
					$location.path('service-types');
				});
			}
		};

		// Update existing Service type
		$scope.update = function() {
			var serviceType = $scope.serviceType;

			serviceType.$update(function() {
				$location.path('service-types/' + serviceType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service types
		$scope.find = function() {
			$scope.serviceTypes = ServiceTypes.query();
		};

		// Find existing Service type
		$scope.findOne = function() {
			$scope.serviceType = ServiceTypes.get({ 
				serviceTypeId: $stateParams.serviceTypeId
			});
		};
	}
]);
'use strict';

//Service types service used to communicate Service types REST endpoints
angular.module('service-types').factory('ServiceTypes', ['$resource',
	function($resource) {
		return $resource('service-types/:serviceTypeId', { serviceTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('service-users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('service-user', 'Service users', 'service-users', 'dropdown', '/service-users(/create)?');
		Menus.addSubMenuItem('service-user', 'service-users', 'List Service users', 'service-users');
		Menus.addSubMenuItem('service-user', 'service-users', 'New Service user', 'service-users/create');
		*/
	}
]);
'use strict';

//Setting up route
angular.module('service-users').config(['$stateProvider',
	function($stateProvider) {
		// Service users state routing
		$stateProvider.
		state('listServiceUsers', {
			url: '/service-users',
			templateUrl: 'modules/service-users/views/list-service-users.client.view.html'
		}).
		state('createServiceUser', {
			url: '/service-users/create',
			templateUrl: 'modules/service-users/views/create-service-user.client.view.html'
		}).
		state('viewServiceUser', {
			url: '/service-users/:serviceUserId',
			templateUrl: 'modules/service-users/views/view-service-user.client.view.html'
		}).
		state('editServiceUser', {
			url: '/service-users/:serviceUserId/edit',
			templateUrl: 'modules/service-users/views/edit-service-user.client.view.html'
		});
	}
]);
'use strict';

// Service users controller
angular.module('service-users').controller('ServiceUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceUsers',
	function($scope, $stateParams, $location, Authentication, ServiceUsers) {
		$scope.authentication = Authentication;

		// Create new Service user
		$scope.create = function() {
			// Create new Service user object
			var serviceUser = new ServiceUsers ({
				name: this.name
			});

			// Redirect after save
			serviceUser.$save(function(response) {
				$location.path('service-users/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service user
		$scope.remove = function(serviceUser) {
			if ( serviceUser ) { 
				serviceUser.$remove();

				for (var i in $scope.serviceUsers) {
					if ($scope.serviceUsers [i] === serviceUser) {
						$scope.serviceUsers.splice(i, 1);
					}
				}
			} else {
				$scope.serviceUser.$remove(function() {
					$location.path('service-users');
				});
			}
		};

		// Update existing Service user
		$scope.update = function() {
			var serviceUser = $scope.serviceUser;

			serviceUser.$update(function() {
				$location.path('service-users/' + serviceUser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service users
		$scope.find = function() {
			$scope.serviceUsers = ServiceUsers.query();
		};

		// Find existing Service user
		$scope.findOne = function() {
			$scope.serviceUser = ServiceUsers.get({ 
				serviceUserId: $stateParams.serviceUserId
			});
		};
	}
]);
'use strict';

//Service users service used to communicate Service users REST endpoints
angular.module('service-users').factory('ServiceUsers', ['$resource',
	function($resource) {
		return $resource('service-users/:serviceUserId', { serviceUserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('services').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('services', 'Services', 'services', 'dropdown', '/services(/create)?');
		Menus.addSubMenuItem('services', 'services', 'List Services', 'services');
		Menus.addSubMenuItem('services', 'services', 'New Service', 'services/create');
		*/
	}
]);
'use strict';

//Setting up route
angular.module('services').config(['$stateProvider',
	function($stateProvider) {
		// Services state routing
		$stateProvider.
		state('listServices', {
			url: '/services',
			templateUrl: 'modules/services/views/list-services.client.view.html'
		}).
		state('createService', {
			url: '/services/create',
			templateUrl: 'modules/services/views/create-service.client.view.html'
		}).
		state('viewService', {
			url: '/services/:serviceId',
			templateUrl: 'modules/services/views/view-service.client.view.html'
		}).
		state('editService', {
			url: '/services/:serviceId/edit',
			templateUrl: 'modules/services/views/edit-service.client.view.html'
		});
	}
]);
'use strict';

// Services controller
angular.module('services').controller('ServicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Services',
	function($scope, $stateParams, $location, Authentication, Services) {
		$scope.authentication = Authentication;

		// Create new Service
		$scope.create = function() {
			// Create new Service object
			var service = new Services ({
				name: this.name
			});

			// Redirect after save
			service.$save(function(response) {
				$location.path('services/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service
		$scope.remove = function(service) {
			if ( service ) { 
				service.$remove();

				for (var i in $scope.services) {
					if ($scope.services [i] === service) {
						$scope.services.splice(i, 1);
					}
				}
			} else {
				$scope.service.$remove(function() {
					$location.path('services');
				});
			}
		};

		// Update existing Service
		$scope.update = function() {
			var service = $scope.service;

			service.$update(function() {
				$location.path('services/' + service._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Services
		$scope.find = function() {
			$scope.services = Services.query();
		};

		// Find existing Service
		$scope.findOne = function() {
			$scope.service = Services.get({ 
				serviceId: $stateParams.serviceId
			});
		};
	}
]);
'use strict';

//Services service used to communicate Services REST endpoints
angular.module('services').factory('Services', ['$resource',
	function($resource) {
		return $resource('services/:serviceId', { serviceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('transaction-types').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('transaction-types', 'Transaction types', 'transaction-types', 'dropdown', '/transaction-types(/create)?');
		Menus.addSubMenuItem('transaction-types', 'transaction-types', 'List Transaction types', 'transaction-types');
		Menus.addSubMenuItem('transaction-types', 'transaction-types', 'New Transaction type', 'transaction-types/create');
		*/
	}
]);
'use strict';

//Setting up route
angular.module('transaction-types').config(['$stateProvider',
	function($stateProvider) {
		// Transaction types state routing
		$stateProvider.
		state('listTransactionTypes', {
			url: '/transaction-types',
			templateUrl: 'modules/transaction-types/views/list-transaction-types.client.view.html'
		}).
		state('createTransactionType', {
			url: '/transaction-types/create',
			templateUrl: 'modules/transaction-types/views/create-transaction-type.client.view.html'
		}).
		state('viewTransactionType', {
			url: '/transaction-types/:transactionTypeId',
			templateUrl: 'modules/transaction-types/views/view-transaction-type.client.view.html'
		}).
		state('editTransactionType', {
			url: '/transaction-types/:transactionTypeId/edit',
			templateUrl: 'modules/transaction-types/views/edit-transaction-type.client.view.html'
		});
	}
]);
'use strict';

// Transaction types controller
angular.module('transaction-types').controller('TransactionTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TransactionTypes',
	function($scope, $stateParams, $location, Authentication, TransactionTypes) {
		$scope.authentication = Authentication;

		// Create new Transaction type
		$scope.create = function() {
			// Create new Transaction type object
			var transactionType = new TransactionTypes ({
				name: this.name
			});

			// Redirect after save
			transactionType.$save(function(response) {
				$location.path('transaction-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Transaction type
		$scope.remove = function(transactionType) {
			if ( transactionType ) { 
				transactionType.$remove();

				for (var i in $scope.transactionTypes) {
					if ($scope.transactionTypes [i] === transactionType) {
						$scope.transactionTypes.splice(i, 1);
					}
				}
			} else {
				$scope.transactionType.$remove(function() {
					$location.path('transaction-types');
				});
			}
		};

		// Update existing Transaction type
		$scope.update = function() {
			var transactionType = $scope.transactionType;

			transactionType.$update(function() {
				$location.path('transaction-types/' + transactionType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Transaction types
		$scope.find = function() {
			$scope.transactionTypes = TransactionTypes.query();
		};

		// Find existing Transaction type
		$scope.findOne = function() {
			$scope.transactionType = TransactionTypes.get({ 
				transactionTypeId: $stateParams.transactionTypeId
			});
		};
	}
]);
'use strict';

//Transaction types service used to communicate Transaction types REST endpoints
angular.module('transaction-types').factory('TransactionTypes', ['$resource',
	function($resource) {
		return $resource('transaction-types/:transactionTypeId', { transactionTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('transactions').config(['$stateProvider',
	function($stateProvider) {
		// Transactions state routing
		$stateProvider.
		state('listTransactions', {
			url: '/transactions',
			templateUrl: 'modules/transactions/views/list-transactions.client.view.html'
		}).
		state('createTransaction', {
			url: '/transactions/create',
			templateUrl: 'modules/transactions/views/create-transaction.client.view.html'
		}).
		state('viewTransaction', {
			url: '/transactions/:transactionId',
			templateUrl: 'modules/transactions/views/view-transaction.client.view.html'
		}).
		state('editTransaction', {
			url: '/transactions/:transactionId/edit',
			templateUrl: 'modules/transactions/views/edit-transaction.client.view.html'
		});
	}
]);
'use strict';

// Transactions controller
angular.module('transactions').controller('TransactionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Transactions',
	function($scope, $stateParams, $location, Authentication, Transactions) {
		$scope.authentication = Authentication;

		// Create new Transaction
		$scope.create = function() {
			// Create new Transaction object
			var transaction = new Transactions ({
				name: this.name
			});

			// Redirect after save
			transaction.$save(function(response) {
				$location.path('transactions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Transaction
		$scope.remove = function(transaction) {
			if ( transaction ) { 
				transaction.$remove();

				for (var i in $scope.transactions) {
					if ($scope.transactions [i] === transaction) {
						$scope.transactions.splice(i, 1);
					}
				}
			} else {
				$scope.transaction.$remove(function() {
					$location.path('transactions');
				});
			}
		};

		// Update existing Transaction
		$scope.update = function() {
			var transaction = $scope.transaction;

			transaction.$update(function() {
				$location.path('transactions/' + transaction._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Transactions
		$scope.find = function() {
			$scope.transactions = Transactions.query();
		};

		// Find existing Transaction
		$scope.findOne = function() {
			$scope.transaction = Transactions.get({ 
				transactionId: $stateParams.transactionId
			});
		};
	}
]);
'use strict';

//Transactions service used to communicate Transactions REST endpoints
angular.module('transactions').factory('Transactions', ['$resource',
	function($resource) {
		return $resource('transactions/:transactionId', { transactionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);