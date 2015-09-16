/* Required
-------------------------------*/
var string = require('eden-string')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_EMPTY		: 'Cannot be empty!',
	
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
		
		if(this.validate().isEmpty(item.auth_slug)) {
			errors.auth_slug = this.INVALID_EMPTY;
		}
		
		if(this.validate().isEmpty(item.auth_password)) {
			errors.auth_password = this.INVALID_EMPTY;
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
		
		var search = this.database
			.search('auth')
			.setColumns('profile.*', 'file_link AS profile_image', 'auth.*')
			.innerJoinOn('auth_profile', 'auth_profile_auth = auth_id')
			.innerJoinOn('profile', 'auth_profile_profile = profile_id')
			.innerJoinOn('profile_file', 'profile_file_profile = profile_id')
			.innerJoinOn('file', 'profile_file_file = file_id AND file_type = \'main_profile\'')
			.filterByAuthSlug(item.auth_slug)
			.filterByAuthPassword(string.md5(item.auth_password));
		
		search.getRow(function(error, row) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(error, row);
			this.database.trigger('app-login', row);
		}.bind(this));
	}
};
