var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should update product', function(done) {
		fixture.controller.job('profile-update')({
			data: {
				item: {
					profile_id		: fixture.you.profile.profile_id,
					profile_name	: 'JOB PROFILE TEST 123456'
				}
			}
		}, function(error) {
			assert.equal(null, error);
			
			done();
		});
	});
};