var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should create session', function(done) {
		fixture.controller.job('session-request')({
			data: {
				item: {
					app_id	: fixture.me.app_id,
					auth_id	: fixture.you.auth.auth_id,
					session_permissions: fixture.config.test.scope.join(',')
				}
			}
		}, function(error, results) {
			assert.equal(null, error);
			
			fixture.sample = results;
			
			done();
		});
	});
};