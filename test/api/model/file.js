var assert = require('assert');

module.exports = function(controller, config) {
	describe('File', function() {
		var fixture = {
			file		: null,
			controller	: controller
		};
		
		describe('Create', function () {
			require('./file/create')(fixture);
		});
		
		describe('Detail', function () {
			require('./file/detail')(fixture);
		});
		
		describe('List', function () {
			require('./file/list')(fixture);
		});
		
		describe('Remove', function () {
			require('./file/remove')(fixture);
		});
	});
};
