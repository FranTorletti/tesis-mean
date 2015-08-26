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