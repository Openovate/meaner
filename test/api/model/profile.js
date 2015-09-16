var assert = require('assert');

module.exports = function(controller, config) {
	describe('Profile', function() {
		var fixture = {
			profile		: null,
			controller	: controller
		};
		
		describe('Create', function () {
			require('./profile/create')(fixture);
		});
		
		describe('Module', function () {
			require('./profile/module')(fixture);
		});
		
		describe('Detail', function () {
			require('./profile/detail')(fixture);
		});
		
		describe('List', function () {
			require('./profile/list')(fixture);
		});
		
		describe('Update', function () {
			require('./profile/update')(fixture);
		});
		
		describe('Set', function () {
			require('./profile/set')(fixture);
		});
		
		describe('Remove', function () {
			require('./profile/remove')(fixture);
		});
	});
};
