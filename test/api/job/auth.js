var assert = require('assert');

module.exports = function(controller, config) {
	describe('Auth', function() {
		var fixture = {
			controller	: controller,
			config		: config
		};
		
		describe('Create', function () {
			require('./auth/create')(fixture);
		});
		
		describe('Update', function () {
			require('./auth/update')(fixture);
		});
	});
};