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