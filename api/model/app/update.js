/* Required
-------------------------------*/
var time = require('eden-time')();

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
	INVALID_ID 			: 'Invalid ID!',
	
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
		
		//REQUIRED
		
		// app_id			Required
		if(!this.validate().isInteger(item.app_id)) {
			errors.app_id = this.INVALID_ID;
		}
		
		// app_name				Required
		if(this.validate().isSet(item.app_name) 
		&& this.validate().isEmpty(item.app_name)) {
			errors.app_name = this.INVALID_SET;
		}
		
		// app_permissions		Required
		if(this.validate().isSet(item.app_permissions) 
		&& this.validate().isEmpty(item.app_permissions)) {
			errors.app_permissions = this.INVALID_SET;
		}
		
		//OPTIONAL
		
		// app_flag
		if(this.validate().isSet(item.app_flag) 
		&& !this.validate().isSmall(item.app_flag)) {
			errors.app_flag = this.INVALID_SMALL;
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
		item = this.validate().prepare(item);
		
		//generate dates
		var updated = time.toDate(new Date(), 'Y-m-d H:i:s');
		
		//SET WHAT WE KNOW
		var model = this.database.model()
			// app_id
			.setAppId(item.app_id)
			// app_updated
			.setAppUpdated(updated);
		
		//REQUIRED
		
		// app_name				Required
		if(!this.validate().isEmpty(item.app_name)) {
			model.setAppName(item.app_name);
		}
			
		// app_permissions		Required
		if(!this.validate().isEmpty(item.app_permissions)) {
			model.setAppPermissions(item.app_permissions);
		}
		
		//OPTIONAL
		
		// app_domain
		if(this.validate().isSet(item.app_domain)) {
			model.setAppDomain(item.app_domain);
		}

		// app_website		
		if(this.validate().isSet(item.app_website)) {
			model.setAppWebsite(item.app_website);
		}

		// app_type
		if(this.validate().isSet(item.app_type)) {
			model.setAppType(item.app_type);
		}
		
		// app_flag
		if(this.validate().isSmall(item.app_flag)) {
			model.setAppFlag(item.app_flag);
		}
		
		//what's left ?
		model.save('app', function(error, model) {
			if(error) {
				return callback(error.toString());
			}

			callback(error, model);
			
			this.database.trigger('app-update', model);
		}.bind(this));
	},
};
