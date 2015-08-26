'use strict';

//Service records service used to communicate Service records REST endpoints
angular.module('service-records').factory('ServiceRecords', ['$resource',
	function($resource) {
		return $resource('service-records/:serviceRecordId', { serviceRecordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);