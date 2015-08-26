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