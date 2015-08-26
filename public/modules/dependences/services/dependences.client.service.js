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