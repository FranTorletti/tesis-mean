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