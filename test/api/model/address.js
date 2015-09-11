var assert = require('assert');

module.exports = function(controller, config) {
	describe('Address', function() {
		var fixture = {
			public_address	: null,
			private_address	: null,
			controller		: controller
		};
		
		describe('Create', function () {
			require('./address/create')(fixture);
		});
		
		describe('Detail', function () {
			require('./address/detail')(fixture);
		});
		
		describe('List', function () {
			require('./address/list')(fixture);
		});
		
		describe('Update', function () {
			require('./address/update')(fixture);
		});
		
		describe('Remove', function () {
			require('./address/remove')(fixture);
		});
	});
};
