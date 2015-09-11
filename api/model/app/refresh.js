/* Required
-------------------------------*/
var time 	= require('eden-time')();
var string 	= require('eden-string')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_ID			: 'Invalid ID',
	
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
		
		if(!this.controller.validate().isInteger(item.app_id)) {
			errors.app_id = this.INVALID_ID;
		}
		
		return errors;
	},
	
	/**
	 * 1. Update the app
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
		item = this.controller.validate().prepare(item || {});
		
		//generate dates
		var updated = time.toDate(new Date(), 'Y-m-d H:i:s');
		
		var token 	= string.md5(string.uuid());
		var secret 	= string.md5(string.uuid()); 
		
		//SET WHAT WE KNOW
		var model = this.database.model()
			// app_id
			.setAppId(item.app_id)
			
			// app_token		Required
			.setAppToken(token)
			
			// app_secret		Required
			.setAppSecret(secret)
			
			// app_updated
			.setAppUpdated(updated);
		
		//what's left ?
		model.save('app', function(error, model) {
			if(error) {
				return callback(error.toString());
			}

			callback(error, model);
			
			this.database.trigger('app-refresh', model);
		}.bind(this));
	},
};
