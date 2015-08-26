'use strict';

// Configuring the Articles module
angular.module('transaction-types').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('transaction-types', 'Transaction types', 'transaction-types', 'dropdown', '/transaction-types(/create)?');
		Menus.addSubMenuItem('transaction-types', 'transaction-types', 'List Transaction types', 'transaction-types');
		Menus.addSubMenuItem('transaction-types', 'transaction-types', 'New Transaction type', 'transaction-types/create');
	}
]);