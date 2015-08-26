'use strict';

// Configuring the Articles module
angular.module('service-users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('service-user', 'Service users', 'service-users', 'dropdown', '/service-users(/create)?');
		Menus.addSubMenuItem('service-user', 'service-users', 'List Service users', 'service-users');
		Menus.addSubMenuItem('service-user', 'service-users', 'New Service user', 'service-users/create');
	}
]);