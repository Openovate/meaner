var assert 	= require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should refresh tokens', function(done) {
		fixture.controller.job('app-refresh')({
			data: {
				item: {
					app_id: fixture.sample.app.app_id,
				}
			}
		}, function(error, results) {
			assert.equal(null, error);
			
			done();
		});
	});
};