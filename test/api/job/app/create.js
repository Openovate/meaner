var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should create app', function(done) {
		fixture.controller.job('app-create')({
			data: {
				profile_id: fixture.me.profile_id,
				item: {
					app_name		: 'TEST APP',
					app_permissions: fixture.config.test.scope.join(',')
				}
			}
		}, function(error, results) {
			assert.equal(null, error);
			
			fixture.sample = results;
			
			done();
		});
	});
};