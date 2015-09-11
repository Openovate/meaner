var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should create and link file', function (done) {
		fixture.controller.model('file').create().process({
			file_link: 'http://example.com/sample.gif'
		}, function(error, model) {
			fixture.file = model.get();
			
			fixture.controller.model('profile').linkFile({
				file_id: fixture.file.file_id,
				profile_id: fixture.profile.profile_id
			}, function(error) {
				assert.equal(null, error);
				done();
			});	
		});
	});
	
	it('should unlink and remove file', function (done) {
		fixture.controller.model('profile').unlinkFile({
			file_id		: fixture.file.file_id,
			profile_id	: fixture.profile.profile_id
		}, function(error) {
			assert.equal(null, error);
			
			fixture.controller.model('file').remove().process({
				file_id: fixture.file.file_id
			}, function(error) {
				assert.equal(null, error);
				done();
			});
		});	
	});
	
	it('should unlink all files', function (done) {
		fixture.controller.model('profile').unlinkAllFiles(
			fixture.profile.profile_id, 
			[], 
		function(error) {
			assert.equal(null, error);
			done();
		});	
	});
};