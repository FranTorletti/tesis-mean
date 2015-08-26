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