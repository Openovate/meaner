/* Required
-------------------------------*/
var string 	= require('eden-string')();
var time 	= require('eden-time')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_ID			: 'Invalid ID',
	
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	/**
	 * Returns errors if any
	 *
	 * @param object submitted item object
	 * @return object error object
	 */
	errors: function(item, errors) {
		errors = errors || {};
		
		//prepare
		item = this.validate().prepare(item);
		
		if(this.validate().isEmpty(item.app_id)) {
			errors.app_id = this.INVALID_ID;
		}
		
		if(this.validate().isEmpty(item.auth_id)) {
			errors.auth_id = this.INVALID_ID;
		}
		
		return errors;
	},
	
	/**
	 * Processes the form
	 *
	 * @param object item object
	 * @param function callback whenever it's done
	 * @return void
	 */
	process: function(item, callback) {
		item 		= item 		|| {};
		callback 	= callback 	|| function() {};
		
		//prevent uncatchable error
		if(Object.keys(this.errors(item)).length) {
			return callback(this.INVALID_PARAMETERS);
		}
		
		//prepare
		item = this.validate().prepare(item);
		
		var token 		= string.md5(string.uuid());
		var secret 		= string.md5(string.uuid());
		var created 	= time.toDate(new Date(), 'Y-m-d H:i:s');
		var updated 	= time.toDate(new Date(), 'Y-m-d H:i:s');
		
		var model = this.database
			.model()
			//session
			.setSessionToken(token)
			.setSessionSecret(secret)
			.setSessionPermissions(item.session_permissions || 'public_sso')
			.setSessionState('PENDING')
			.setSessionCreated(created)
			.setSessionUpdated(updated)
			//session_app
			.setSessionAppApp(item.app_id)
			//session_auth
			.setSessionAuthAuth(item.auth_id);
		
		//remove user pending states
		var search = this.database
			.search('session')
			.innerJoinOn('session_auth', 'session_auth_session = session_id')
			.innerJoinOn('session_app', 'session_app_session = session_id')
			.filterBySessionAppApp(item.app_id)
			.filterBySessionAuthAuth(item.auth_id)
			.filterBySessionStatus('PENDING');
		
		search.getCollection(function(error, collection) {
			if(error) {
				return callback(error.toString());
			}
			
			collection
				.remove('session', function() {})
				.remove('session_auth', function() {})
				.remove('session_app', function() {});
			
			//grant access from data.auth and response.app 
			model.save('session', function(error, model) {
				if(error) {
					return callback(error.toString());
				}
				
				model
					.copy('session_id', 'session_app_session')
					.copy('session_id', 'session_auth_session')
					.insert('session_app', function() {
						model.insert('session_auth', function() {
							callback(error, model);
							this.database.trigger('user-request', model);
						}.bind(this));
					}.bind(this));
			}.bind(this));
		}.bind(this));
	}
};
