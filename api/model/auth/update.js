/* Required
-------------------------------*/
var string 		= require('eden-string')();
var time 		= require('eden-time')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_EMPTY		: 'Cannot be empty!',
	INVALID_SET			: 'Cannot be empty, if set',
	INVALID_FLOAT		: 'Should be a valid floating point',
	INVALID_INTEGER		: 'Should be a valid integer',
	INVALID_NUMBER		: 'Should be a valid number',
	INVALID_BOOL		: 'Should either be 0 or 1',
	INVALID_SMALL		: 'Should be between 0 and 9',
	INVALID_ID			: 'Invalid ID',
	MISMATCH			: 'Passwords do not match!',
	
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
		
		//REQUIRED
		
		// auth_id			Required
		if(!this.controller.validate().isInteger(item.auth_id)) {
			errors.auth_id = this.INVALID_ID;
		}
		
		//auth_slug		Required
		if(this.controller.validate().isSet(item.auth_slug) 
		&& this.controller.validate().isEmpty(item.auth_slug)) {
			errors.auth_slug = this.INVALID_EMPTY;
		}
		
		// auth_permissions		Required
		if(this.controller.validate().isSet(item.auth_permissions) 
		&& this.controller.validate().isEmpty(item.auth_permissions)) {
			errors.auth_permissions = this.INVALID_SET;
		}
		
		//confirm			NOT IN SCHEMA
		if(((!this.controller.validate().isEmpty(item.auth_password))
		|| (!this.controller.validate().isEmpty(item.confirm)))
		&& item.confirm !== item.auth_password) {
			errors.confirm = this.MISMATCH;
		}
		
		//OPTIONAL
		
		// auth_flag
		if(this.controller.validate().isSet(item.auth_flag) 
		&& !this.controller.validate().isSmall(item.auth_flag)) {
			errors.auth_flag = this.INVALID_SMALL;
		}
		
		return errors;
	},
	
	/**
	 * Process the form
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
		
		var updated = time.toDate(new Date(), 'Y-m-d H:i:s');
		
		var model = this.database.model()
			//auth_id			Required
			.setAuthId(item.auth_id)
			
			//auth_updated		Required
			.setAuthUpdated(updated);
		
		// auth_permissions		Required
		if(!this.controller.validate().isEmpty(item.auth_permissions)) {
			model.setAuthPermissions(item.auth_permissions);
		}
		
		if(!this.controller.validate().isEmpty(item.auth_password)) {
			model.setAuthPassword(string.md5(item.auth_password));
		}
		
		if(!this.controller.validate().isEmpty(item.auth_slug)) {
			model.setAuthSlug(item.auth_slug);
		}
		
		//OPTIONAL
		
		// auth_type
		if(this.controller.validate().isSet(item.auth_type)) {
			model.setAuthType(item.auth_type);
		}
		
		// auth_flag
		if(this.controller.validate().isSmall(item.auth_flag)) {
			model.setAuthFlag(item.auth_flag);
		}
		
		// auth_facebook_token
		if(this.controller.validate().isSet(item.auth_facebook_token)) {
			model.setAuthFacebookToken(item.auth_facebook_token);
		}
		
		// auth_facebook_secret
		if(this.controller.validate().isSet(item.auth_facebook_secret)) {
			model.setAuthFacebookSecret(item.auth_facebook_secret);
		}
		
		// auth_twitter_token
		if(this.controller.validate().isSet(item.auth_twitter_token)) {
			model.setAuthTwitterToken(item.auth_twitter_token);
		}
		
		// auth_twitter_secret
		if(this.controller.validate().isSet(item.auth_twitter_secret)) {
			model.setAuthTwitterSecret(item.auth_twitter_secret);
		}
		
		// auth_linkedin_token
		if(this.controller.validate().isSet(item.auth_linkedin_token)) {
			model.setAuthLinkedinToken(item.auth_linkedin_token);
		}
		
		// auth_linkedin_secret
		if(this.controller.validate().isSet(item.auth_linkedin_secret)) {
			model.setAuthLinkedinSecret(item.auth_linkedin_secret);
		}
		
		// auth_google_token
		if(this.controller.validate().isSet(item.auth_google_token)) {
			model.setAuthGoogleToken(item.auth_google_token);
		}
		
		// auth_google_secret
		if(this.controller.validate().isSet(item.auth_google_secret)) {
			model.setAuthGoogleSecret(item.auth_google_secret);
		}
		
		model.save('auth', function(error, model) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(null, model);
			
			this.database.trigger('auth-update', model);
		}.bind(this));
	}
};
