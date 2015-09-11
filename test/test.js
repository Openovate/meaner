var assert 		= require('assert');
var config		= require('../config');
var controller 	= require('../api/index');

describe('Test Suite', function() {
	//use a test database
	before(function(done) {
		require('./helper/create-database')(controller, config, function(error, results) {
			if(error) {
				return done(error);
			}
			
			done();
		});
	});
	
	describe('Unit Tests', function() {
		require('./api/model/app')(controller, config);
		require('./api/model/auth')(controller, config);
		require('./api/model/file')(controller, config);
		require('./api/model/profile')(controller, config);
		require('./api/model/session')(controller, config);
		require('./api/model/address')(controller, config);
	});
	
	describe('Job Tests', function() {
		require('./api/job/app')(controller, config);
		require('./api/job/auth')(controller, config);
		require('./api/job/profile')(controller, config);
		require('./api/job/session')(controller, config);
	});
	
	describe('REST Tests', function() {
		require('./api/action/profile')(controller, config);
	});
});