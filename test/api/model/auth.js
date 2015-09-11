var assert = require('assert');

module.exports = function(controller, config) {
	describe('Auth', function() {
		var fixture = {
			auth		: null,
			controller	: controller
		};
		
		describe('Create', function () {
			require('./auth/create')(fixture);
		});
		
		describe('Module', function () {
			require('./auth/module')(fixture);
		});
		
		describe('Update', function () {
			require('./auth/update')(fixture);
		});
		
		describe('Remove', function () {
			require('./auth/remove')(fixture);
		});
	});
};