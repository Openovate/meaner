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
	INVALID_EMPTY		: 'Cannot be empty!',
	EXPIRED				: 'Expired Token',
	
	/* Properties
	-------------------------------*/
	controller	: require('../../controller'),
	database	: require('../../controller').database,
	
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
		item = this.controller.validate().prepare(item);
		
		if(this.controller.validate().isEmpty(item.client_id)) {
			errors.client_id = this.INVALID_EMPTY;
		}
		
		if(this.controller.validate().isEmpty(item.client_secret)) {
			errors.client_secret = this.INVALID_EMPTY;
		}
		
		if(this.controller.validate().isEmpty(item.code)) {
			errors.code = this.INVALID_EMPTY;
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
		item = this.controller.validate().prepare(item);
		
		var token 		= string.md5(string.uuid());
		var secret 		= string.md5(string.uuid());
		var updated 	= time.toDate(new Date(), 'Y-m-d H:i:s');
		
		//check the session first
		var search = this.database
			.search('session')
			.innerJoinOn('session_app', 'session_app_session = session_id')
			.innerJoinOn('app', 'session_app_app = app_id')
			.innerJoinOn('session_auth', 'session_auth_session = session_id')
			.innerJoinOn('auth_profile', 'session_auth_auth = auth_profile_auth')
			.innerJoinOn('profile', 'auth_profile_profile = profile_id')
			.innerJoinOn('profile_file', 'profile_file_profile = profile_id')
			.innerJoinOn('file', "profile_file_file = file_id AND file_type='main_profile'")
			.filterByAppToken(item.client_id)
			.filterByAppSecret(item.client_secret)
			.filterBySessionToken(item.code);
		
		search.getModel(function(error, model) {
			if(error) {
				return callback(error.toString());
			}
			
			if(!model || model.session_status !== 'PENDING') {
				callback(this.EXPIRED);
				return;
			}
			
			//okay it matches
			//Vulnerability lets assume the session permissions is valid
			//we just process from here
			model
				.setSessionToken(token)
				.setSessionSecret(secret)
				.setSessionStatus('ACCESS')
				.setSessionUpdated(updated);
			
			model.save(function(error, model) {
				if(error) {
					callback(error.toString());
					return;
				}
				
				callback(error, {
					profile_id			: model.profile_id,
					profile_name		: model.profile_name,
					profile_email		: model.profile_email,
					profile_phone		: model.profile_phone,
					profile_detail		: model.profile_detail,
					profile_birth		: model.profile_birth,
					profile_gender		: model.profile_gender,
					profile_website		: model.profile_website,
					profile_facebook	: model.profile_facebook,
					profile_twitter		: model.profile_twitter,
					profile_linkedin	: model.profile_linkedin,
					profile_google		: model.profile_google,
					profile_type		: model.profile_type,
					profile_image		: model.file_link,
					access_token		: model.session_token,
					access_secret		: model.session_secret,
					access_permissions	: model.session_permissions.split(',') });	
					
				this.database.trigger('user-request', model);
			}.bind(this));
		}.bind(this));
	}
};