/* Required
-------------------------*/
var config = require('./config');

/* Build Script
-------------------------*/
module.exports = {
	/* Properties
	-------------------------*/
	configs		: {
		'/api/config/database'	: config.api.database,
		'/api/config/events'	: config.api.events,
		'/api/config/jobs'		: config.api.jobs,
		'/api/config/mail'		: config.api.mail,
		'/api/config/roles'		: config.api.roles,
		'/api/config/routes'	: config.api.routes,
		'/api/config/s3'		: config.api.s3,
		'/api/config/scope'		: config.api.scope,
		'/api/config/server'	: config.api.server
	},
	
	indexes		: [],
	styles		: {},
	apps		: {},
	
	/* Construct
	-------------------------*/
	constructor: function() {
		var environment = 'development';
		Array.prototype.slice.apply(process.argv).forEach(function(argument) {
			if(argument === '-production'
			|| argument === '-live') {
				environment = 'production';
			}
			
			if(argument === '-database') {
				this.buildDatabase();
			}
		}.bind(this));
		
		//build all the configs
		Object.keys(this.configs).forEach(function(path) {
			this.buildConfig(path, this.configs[path]);
		}.bind(this));
		
		//build all the indexes
		this.indexes.forEach(function(path) {
			this.buildIndex(path, environment);
		}.bind(this));
		
		//build all the styles
		Object.keys(this.styles).forEach(function(path) {
			this.buildCSS(path, this.styles[path]);
		}.bind(this));
		
		//build all the styles
		Object.keys(this.apps).forEach(function(path) {
			this.buildApp(
				path, 
				this.apps[path].pre,
				this.apps[path].list,
				this.apps[path].post);
		}.bind(this));
	},
	
	isInstalled: function() {
		try {
			require('eden-file');
		} catch(e) {
			return false;
		}
		
		return true;
	},
	
	mangle: function(path) {
		var code = uglify.minify(root + path).code;
		return '"' + path + '":"eval;' + encodeURIComponent(code) + '"';
	},
	
	template: function(path, content) {
		return '"' + path + '":"eval;' + encodeURIComponent(content.toString('utf8')) + '"';
	},
	
	buildApp: function(root, preList, list, postList, cache) {
		cache = cache || [];
		
		if(!list.length) {
			preList.forEach(function(path, i) {
				preList[i] = __dirname + root + path;
			});
			
			postList.forEach(function(path, i) {
				postList[i] = __dirname + root + path;
			});
			
			preList = uglify.minify(preList).code;
			postList = uglify.minify(postList).code;
			
			//now save the file
			var content = preList + "\n" + 'require.load({' + cache.join(",\n") + "});\n" + postList;
			
			file(__dirname + root + '/build.js').setContent(content, function(error) {
				if(error) {
					return console.log(error);
				}
	
				console.log('File', root + '/build.js', 'was made.');
			});
			
			return;
		}
		
		var path = list.shift();
		
		//if js
		if(path.indexOf('.js') !== -1) {
			cache.push(this.mangle(path));
			
			//recurse
			return this.bundleJS(root, preList, list, postList, cache);
		}
		
		//process other
		file(__dirname + root + path).getContent(function(error, content) {
			if(error) {
				return console.log(error);
			}
			
			content = content.toString('utf8');
			cache.push(this.template(path, content));
			
			//recurse
			this.buildApp(root, preList, list, postList, cache);
		}.bind(this));
	},
	
	buildCSS: function(path, list, cache) {
		cache = cache || [];
		
		if(!list.length) {
			file(__dirname + path + '/build.css')
				.setContent(cache.join(''), function(error) {
					if(error) {
						return console.log(error);
					}
		
					console.log('File', root + '/build.css', 'was made.');
				});
			
			return;
		}
		
		var stylePath = list.shift();
		
		file(__dirname + path + stylePath).getContent(function(error, content) {
			if(error) {
				return console.log(error);
			}
			
			content = content.toString('utf8').replace(/\s+/ig, ' ')
			
			var folder = path.split('/');
			
			folder.pop();
			
			folder = folder.join('/')
			
			content = content.replace(/url\(\'/ig, 'url(\'' + folder + '/');
			content = content.replace(/url\(\"/ig, 'url(\"' + folder + '/');
			
			content = content.replace(new RegExp('url\\(\\\'' + folder.replace(/\//ig, '\\/') + '\\\/data', 'ig'), 'url(\'data');
			content = content.replace(new RegExp('url\\(\\\"' + folder.replace(/\//ig, '\\/') + '\\\/data', 'ig'), 'url("data');
			
			cache.push(content);
			
			//recurse
			this.buildCSS(root, list, cache);
		}.bind(this));
	},
	
	buildIndex: function(path, environment) {
		file(__dirname + path + '/' + environment + '.index.html')
			.getContent(function(error, content) {
				if(error) {
					return console.log(error);
				}
				
				content = content.toString('utf8').replace(/\{VERSION\}/ig, Date.now());
				
				file(__dirname + path + '/index.html')
					.setContent(content, function(error) {
						if(error) {
							return console.log(error);
						}
			
						console.log('File', root + '/' + environment + '.index.html', 'was copied.');
					});		
			});
	},
	
	buildConfig: function(path, data) {
		file(__dirname + path + '.json').setData(data, function(error) {
			if(error) {
				return console.log(error);
			}
			
			console.log('File', path + '.json', 'was made.');
		});
	},
	
	buildDatabase: function(callback) {
		callback = callback || function() {};
		console.log('Creating Database');
		
		sync().then(function(next) {
			var connection = database(
				config.api.database.host, 
				config.api.database.port, 
				'', 
				config.api.database.user, 
				config.api.database.pass);
			
			next(connection);	
		})
		.then(function(connection, next) {
			connection.query('DROP DATABASE IF EXISTS `'+config.api.database.name+'`', function(error) {
				if(error) {
					connection.disconnect();
					return console.log(error);
				}	
				
				next(connection);
			});
		})
		.then(function(connection, next) {
			connection.query('CREATE DATABASE `'+config.api.database.name+'`', function(error) {
				if(error) {
					connection.disconnect();
					return console.log(error);
				}	
				
				connection.disconnect();
				next();
			});
		})
		.then(function(next) {
			var connection = database(
				config.api.database.host, 
				config.api.database.port, 
				config.api.database.name, 
				config.api.database.user, 
				config.api.database.pass);
			
			file('./schema.sql').getContent(function(error, content) {
				if(error) {
					connection.disconnect();
					return console.log(error);
				}	
				
				var queries = content.toString().split(';');
				
				queries.push("INSERT INTO `app` (\
					`app_id`, \
					`app_name`, \
					`app_domain`, \
					`app_token`, \
					`app_secret`, \
					`app_permissions`, \
					`app_website`, \
					`app_active`, \
					`app_type`, \
					`app_flag`, \
					`app_created`, \
					`app_updated`\
				) VALUES (\
					1, \
					'Main Application', \
					'*.openovate.com', \
					'"+config.web.app_token+"', \
					'"+config.web.app_secret+"', \
					'public_profile,public_sso,personal_profile,user_profile,god_mode', \
					'http://openovate.com/', \
					1, NULL, 0, '2015-08-21 00:00:00', '2015-08-21 00:00:00'\
				)");
				
				queries.push("INSERT INTO `auth` (\
					`auth_id`, \
					`auth_slug`, \
					`auth_password`, \
					`auth_token`, \
					`auth_secret`, \
					`auth_permissions`, \
					`auth_facebook_token`, \
					`auth_facebook_secret`, \
					`auth_linkedin_token`, \
					`auth_linkedin_secret`, \
					`auth_twitter_token`, \
					`auth_twitter_secret`, \
					`auth_google_token`, \
					`auth_google_secret`, \
					`auth_active`, \
					`auth_type`, \
					`auth_flag`, \
					`auth_created`, \
					`auth_updated`\
				) VALUES (\
					1, \
					'admin@openovate.com', \
					MD5('admin'), \
					'"+config.web.app_token+"', \
					'"+config.web.app_secret+"', \
					'public_profile,public_sso,personal_profile,user_profile', \
					NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 0, \
					'2015-09-11 23:05:17', '2015-09-11 23:05:17'\
				)");
				
				queries.push("INSERT INTO `file` (\
					`file_id`, \
					`file_link`, \
					`file_path`, \
					`file_mime`, \
					`file_active`, \
					`file_type`, \
					`file_flag`, \
					`file_created`, \
					`file_updated`\
				) VALUES (\
					1, \
					'https://s3-ap-southeast-1.amazonaws.com/openovate/images/logo+square.jpg', \
					NULL, \
					'image/jpg', \
					1, \
					'main_profile', \
					0, '2015-09-11 23:05:17', '2015-09-11 23:05:17'\
				)");
				
				queries.push("INSERT INTO `profile` (\
					`profile_id`, \
					`profile_name`, \
					`profile_email`, \
					`profile_phone`, \
					`profile_detail`, \
					`profile_company`, \
					`profile_job`, \
					`profile_gender`, \
					`profile_birth`, \
					`profile_website`, \
					`profile_facebook`, \
					`profile_linkedin`, \
					`profile_twitter`, \
					`profile_google`, \
					`profile_active`, \
					`profile_type`, \
					`profile_flag`, \
					`profile_created`, \
					`profile_updated`\
				) VALUES (\
					1, \
					'Admin', \
					'admin@openovate.com', \
					'+63 (2) 654-5110', \
					NULL, NULL, NULL, NULL, NULL, \
					NULL, NULL, NULL, NULL, NULL, 1, NULL, \
					0, '2015-09-11 23:05:16', '2015-09-11 23:05:16')");
				
				queries.push("INSERT INTO `profile_file` (`profile_file_profile`, `profile_file_file`) VALUES (1, 1)");
				queries.push("INSERT INTO `app_profile` (`app_profile_app`, `app_profile_profile`) VALUES (1, 1)");
				queries.push("INSERT INTO `auth_profile` (`auth_profile_auth`, `auth_profile_profile`) VALUES (1, 1)");
				
				next.thread('query-loop', connection, queries, 0);
			});
		})
		.thread('query-loop', function(connection, queries, i, next) {
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
					next.thread('query-loop', connection, queries, i + 1);
					return;
				}
				
				connection.query(query.join("\n"), function(error) {
					if(error) {
						connection.disconnect();
						return console.log(error);
					}	
					
					next.thread('query-loop', connection, queries, i + 1);
				});
				
				return;
			}
			
			next(connection);
		})
		.then(function(connection, next) {
			connection.disconnect();
			console.log('Database Created');
			callback();
		});
	}
};

var file 		= null,
	uglify 		= null,
	database 	= null,
	sync		= null;

(function() {
	if(module.exports.isInstalled()) {
		console.log('Installed :)');
		
		database 	= require('eden-mysql');
		file 		= require('eden-file');
		uglify 		= require('uglify-js');
		sync 		= require('syncopate');
		
		return module.exports.constructor();
	}

	//it's not even installed...
	console.log('Installing ...');
	
	
	var spawn = require('child_process');
	var child = spawn.exec('npm install');
	
	child.stdout.on('data', function(data) {
		console.log(data.toString()); 
	});
	
	child.stdout.on('end', function() {
		if(process.platform === 'linux') {
			console.log('PhantomJS needs to be built manually for Linux');
			console.log('Please see: http://phantomjs.org/build.html to build it.');
			console.log('');
			console.log('Also, If you do not have redis, run:');
			console.log('wget http://download.redis.io/redis-stable.tar.gz');
			console.log('tar xvzf redis-stable.tar.gz');
			console.log('cd redis-stable');
			console.log('make');
			console.log('');
			console.log('Please re-run this script when everything is installed.');
			return;
		} 
		
		child = spawn.exec('cd seo; composer install');
		
		child.stdout.on('data', function(data) {
			console.log(data.toString()); 
		});
		
		child.stdout.on('end', function() {
			database 	= require('eden-mysql');
			file 		= require('eden-file');
			uglify 		= require('uglify-js');
			sync 		= require('syncopate');
			
			module.exports.constructor();
			module.exports.buildDatabase(function() {
				console.log('If you do not have redis, run:');
				console.log('wget http://download.redis.io/redis-stable.tar.gz');
				console.log('tar xvzf redis-stable.tar.gz');
				console.log('cd redis-stable');
				console.log('make');
				console.log('');
				console.log('Please re-run this script when everything is installed.');
			});
		});
	});
})();

