var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should render access', function(done) {
		fixture.controller.job('session-access')({
			data: {
				item: {
					client_id		: fixture.config.test.app_token,
					client_secret	: fixture.config.test.app_secret,
					code			: fixture.sample.session.session_token
				}
			}
		}, function(error, results) {
			assert.equal(null, error);
			
			done();
		});
	});
};