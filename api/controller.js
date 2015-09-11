var express 		= require('express');
var handlebars		= require('hbs');
var redis			= require('connect-redis');
var path 			= require('path');
var favicon 		= require('serve-favicon');
var logger 			= require('morgan');
var session 		= require('express-session');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var cors 			= require('cors');
var mysql 			= require('eden-mysql');
var language		= require('eden-language');
var kue 			= require('kue');
var syncopate		= require('syncopate'); 
var string			= require('eden-string')(); 

module.exports = {
	/* Properties
	-------------------------------*/
	routes		: [],
	paths 		: {},
	cors		: [
		'X-Requested-With', 
		'Content-Type', 
		'Access', 
		'Origin', 
		'X-App-Origin', 
		'User-Agent'],
	connected	: Date.now(),
	check		: false,
	noop		: function() {},
	
	/* Methods
	-------------------------------*/
	/**
	 * Returns the action class
	 *
	 * @param string
	 * @return object
	 */
	action: function(name) {
		var action = this.path('action');
		return require(action + '/' + name);
	},
	
	/**
	 * Get's a configuration
	 *
	 * @param string
	 * @return this
	 */
	config: function(key) {
		return require(this.paths.config + '/' + key);
	},
	
	/**
	 * Checks for idleness and D/Cs if so
	 *
	 * @return this
	 */
	idle: function() {
		//if it's disconnected 
		if(!this.database.getConnection()) {
			//there is no need to disconnect again
			return;
		}
		
		var idle = Date.now() - this.connected;
		
		//if its not passed the idle limit
		if(idle < 10000) {
			//keep the connection up
			return;
		}
		
		//let's D/C
		this.database.disconnect();
		
		//if there's an interval
		if(this.check) {
			clearInterval(this.check);
			this.check = null;
		}
		
		return this;
	},
	
	/**
	 * Returns the model class
	 *
	 * @param string
	 * @return object
	 */
	job: function(name) {
		var job = this.path('job');
		return require(job + '/' + name).bind(this);
	},
	
	/**
	 * Loads Events
	 *
	 * @return this
	 */
	loadEvents: function() {
		var config 	= this.config('events');
		var path 	= this.path('event');
		
		config.forEach(function(event) {
			require(path + '/' + event)(this);
		}.bind(this));
		
		return this;
	},
	
	/**
	 * Load Jobs
	 *
	 * @return this
	 */
	loadJobs: function() {
		var config 	= this.config('jobs');
		var path 	= this.path('job');
		
		config.forEach(function(job) {
			this.queue.process(job, this.job(job));
		}.bind(this));
		
		return this;
	},
	
	/**
	 * Returns the model class
	 *
	 * @param string
	 * @return object
	 */
	model: function(name) {
		var model = this.path('model');
		return require(model + '/' + name);
	},
	
	/**
	 * Unbinds the specified function
	 * from an event
	 *
	 * @param string
	 * @param function|string
	 * @return this
	 */
	off: function(event, callback) {
		this.database.off(event, callback);
		return this;
	},
	
	/**
     * Attaches an instance to be notified
     * when an event has been triggered
     *
     * @param *string
     * @param *function
     * @param bool
     * @return this
     */
	on: function(event, callback) {
		this.database.on(event, callback);
		return this;
	},

	/**
	 * Attaches an instance to be notified
	 * when an event has been triggered,
	 * when the event was fired it will
	 * be removed on the event stack.
	 *
	 * @param 	*string
	 * @param	*function
	 * @return  this
	 */
	once: function(event, callback) {
		this.database.once(event, callback);

		return this;
	},
	
	/**
	 * Returns the path given the key
	 *
	 * @param string
	 * @return this
	 */
	path: function(key, value) {
		if(value) {
			this.paths[key] = value;
			return this;
		}
		
		return this.paths[key];
	},
	
	/**
	 * Returns the route class
	 *
	 * @param string
	 * @return object
	 */
	route: function(name) {
		var route = this.path('route');
		return require(route + '/' + name + '/index');
	},
	
	/**
	 * Save any database info in memory
	 *
	 * @return this
	 */
	setDatabase: function() {
		var config = this.config('database');
		
		this.database = mysql(
			config.host, 
			config.port, 
			config.name,
			config.user,
			config.pass);
		
		return this;
	},
	
	/**
	 * Save queue in memory
	 *
	 * @return this
	 */
	setQueue: function() {
		this.queue = kue.createQueue();
		
		return this;
	},
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	setPaths: function() {
		this.path('root'	, __dirname)
			.path('action'	, __dirname + '/action')
			.path('config'	, __dirname + '/config')
			.path('model'	, __dirname + '/model')
			.path('event'	, __dirname + '/event')
			.path('job'		, __dirname + '/job')
			.path('public'	, __dirname + '/public')
			.path('upload'	, __dirname + '/public/upload')
			.path('route'	, __dirname + '/route')
			.path('template', __dirname + '/template')
			.path('partial'	, __dirname + '/template/partial');
		
		return this;
	},
	
	/**
	 * Process to start server
	 *
	 * @return this
	 */
	startServer: function() {
		this.express = express;
		this.server = express();
		
		this.cache = new (redis(session))({
			host: '127.0.0.1',
			port: 6379,
			db: 5 });
		
		// view engine setup
		handlebars.registerPartials(this.path('partial'));
		this.server.set('views', this.path('template'));
		this.server.set('view engine', 'html');
		this.server.set('view options', { layout: 'page' });
		this.server.engine('html', handlebars.__express);
		
		//first enable cors
		this.server.use(cors({ allowedHeaders: this.cors }));
		
		// uncomment after placing your favicon in /public
		//this.server.use(favicon(__dirname + '/public/favicon.ico'));
		this.server.use(logger('dev'));
		
		this.server.use(bodyParser.json({ limit: '50mb' }));
		this.server.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
		
		//used for sessions
		this.server.use(cookieParser());
		
		this.server.use(session({
			store: this.cache,
			secret: '1234567890QWERTY', 
			saveUninitialized: true, 
			resave: true }));
		
		//pass static requests
		this.server.use(express.static(this.path('public')));
		
		//push i18n features
		this.server.use(function(request, response, next) {
			if(request.session.i18n) {
				try {
					var data = this.config('i18n/'+request.session.i18n)
					language().load(data);
				} catch(e) {}
			}
			
			next();
		}.bind(this));
		
		//re encode the request body
		this.server.use(function(request, response, next) {
			if(typeof request.body === 'object' 
			&& request.body !== null
			&& Object.keys(request.body).length) {
				request.body = string.queryToHash(string.hashToQuery(request.body));
			}
			
			next();
		}.bind(this));
		
		//trigger that a request has been made
		this.server.use(function(request, response, next) {
			//dont double interval
			if(this.check) {
				clearInterval(this.check);
				this.check = null;
			}
			
			this.connected 	= Date.now();
			this.check 		= setInterval(this.idle.bind(this), 10000);
			
			this.trigger('request', request, response);
			next();
		}.bind(this));
		
		this.server.use('/', this.route('developer'));
		this.server.use('/', this.route('dialog'));
		this.server.use('/', this.route('rest'));
		
		//queue
		kue.app.set('title', 'API Queue');
		
		this.server.use('/queue',function(request, response, next) {
			//quick and dirty auth
			if(request.session.queryAuth === 'iam.app') {
				next();
			} else if(request.query.auth === 'iam.app') {
				request.session.queryAuth = request.query.auth;
				next();
			}
		});
		
		this.server.use('/queue', kue.app);
		
		// catch 404 and forward to error handler
		this.server.use(function(request, response, next) {
			var error = new Error('Not Found');
			error.status = 404;
			next(error);
		});
		
		// error handlers
		
		// development error handler
		// will print stacktrace
		if (this.server.get('env') === 'development') {
			this.server.use(function(error, request, response, next) {
				console.log((new Date).toUTCString(), 'Uncaught Error', error.message);
    			console.log(error.stack);
				
				response.status(error.status || 500);
				response.json({ error: true, message: error.message, stack: error.stack });
			});
		}
		
		// production error handler
		// no stacktraces leaked to user
		this.server.use(function(error, request, response, next) {
			response.status(error.status || 500);
			response.json({ error: true, message: error.message });
		});
		
		//if a response was triggered
		this.on('response', function(request, response) {
			switch(typeof response.output) {
				case 'number':
				case 'string':
					response.send(response.output);
					break;
				case 'object':
					response.json(response.output);
					break;
			}
		});
		
		return this;
	},
	
	/**
	 * Syncronous pattern
	 *
	 * @param function|object
	 * @return object
	 */
	sync: function(callback) {
		var sync = syncopate().scope(this);
		
		Array.prototype.slice.apply(arguments).forEach(function(callback, i) {
			if(typeof callback === 'object') {
				sync.scope(callback);
				return;
			}
			
			if(typeof callback === 'function') {
				return sync.then(callback);
			}
		})
		
		return sync;
	},
	
	/**
     * Notify all observers of that a specific
     * event has happened
     *
     * @param *string
	 * @param mixed[,mixed..]
     * @return this
     */
	trigger: function(event) {
		this.database.trigger.apply(this.database, arguments);
		return this;
	},
	
	/**
     * Returns the validate object
     *
     * @return Validate
     */
	validate: function() {
		return require('./validate');
	}
};