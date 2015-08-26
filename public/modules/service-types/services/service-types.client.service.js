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