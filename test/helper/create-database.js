var database 	= require('eden-mysql');
var file 		= require('eden-file');

module.exports = function(controller, config, callback) {
	callback = callback || function() {};
	
	controller.sync(function(next) {
		var connection = database(
			config.test.database.host, 
			config.test.database.port, 
			'', 
			config.test.database.user, 
			config.test.database.pass);
		
		next(connection);	
	})
	.then(function(connection, next) {
		connection.query('DROP DATABASE IF EXISTS `'+config.test.database.name+'`', function(error) {
			if(error) {
				return callback(error);
			}	
			
			next(connection);
		});
	})
	.then(function(connection, next) {
		connection.query('CREATE DATABASE `'+config.test.database.name+'`', function(error) {
			if(error) {
				return callback(error);
			}	
			
			connection.disconnect();
			next();
		});
	})
	.then(function(next) {
		controller.database = database(
			config.test.database.host, 
			config.test.database.port, 
			config.test.database.name, 
			config.test.database.user, 
			config.test.database.pass);
		
		file(__dirname + '/../../schema.sql').getContent(function(error, content) {
			if(error) {
				return callback(error);
			}	
			
			var queries = content.toString().split(';');
			
			next.thread('query-loop', queries, 0);
		});
	})
	.thread('query-loop', function(queries, i, next) {
		if(i < queries.length) {
			//clean it up
			var query = [];
			
			queries[i].split("\n").forEach(function(line) {
				if(line.indexOf('--') === 0 || line.trim().length === 0) {
					return;
				}
				
				query.push(line);
			});
			
			if(query.join("\n").trim().length === 0) {
				next.thread('query-loop', queries, i + 1);
				return;
			}
			
			controller.database.query(query.join("\n"), function(error) {
				if(error) {
					return callback(error);
				}	
				
				next.thread('query-loop', queries, i + 1);
			});
			
			return;
		}
		
		next();
	})
	.then(function(next) {
		require('./create-app')(controller, {
			app_name		: 'Test App',
			file_link		: 'http://example.com/sample.gif',
			auth_slug		: 'TDD Robot',
			profile_name	: 'TDD Robot',
			auth_password	: '123'
		}, config, next);
		
	})
	.then(function(error, results) {
		if(error) {
			return callback(error);
		}
		
		callback(null, results);
	});
};