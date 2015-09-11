var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should create auth', function(done) {
		fixture.controller.job('auth-create')({
			data: {
				item: {
					profile_name	: 'TEST AUTH JOB',
					profile_email	: 'test@mail.com',
					auth_slug		: 'TEST AUTH JOB',
					auth_permissions: fixture.config.test.scope.join(','),
					auth_password	: '123',
					confirm			: '123'
				}
			}
		}, function(error, results) {
			assert.equal(null, error);
			
			fixture.sample = results;
			
			done();
		});
	});
};