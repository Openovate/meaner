var assert = require('assert');

module.exports = function(controller, config) {
	describe('App', function() {
		var fixture = {
			app			: null,
			controller	: controller
		};
		
		describe('Create', function () {
			require('./app/create')(fixture);
		});
		
		describe('Detail', function () {
			require('./app/detail')(fixture);
		});
		
		describe('List', function () {
			require('./app/list')(fixture);
		});
		
		describe('Module', function () {
			require('./app/module')(fixture);
		});
		
		describe('Update', function () {
			require('./app/update')(fixture);
		});
		
		describe('Remove', function () {
			require('./app/remove')(fixture);
		});
	});
};