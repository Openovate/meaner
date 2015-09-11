var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get profile by token', function(done) {
		fixture.controller.model('session').getProfileByToken(
			fixture.session.access_token,
		function(error, row) {
			assert.equal(fixture.profile_name, row.profile_name);
			done();
		});
	});
};