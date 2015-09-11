var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should update auth', function(done) {
		fixture.controller.job('auth-update')({
			data: {
				item: {
					auth_id			: fixture.sample.auth.auth_id,
					profile_id		: fixture.sample.profile.profile_id,
					profile_name	: 'TEST AUTH JOB 123',
					profile_email	: 'test123@mail.com'
				}
			}
		}, function(error, results) {
			assert.equal(null, error);
			
			done();
		});
	});
};