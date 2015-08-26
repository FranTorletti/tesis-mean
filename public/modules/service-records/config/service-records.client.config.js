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