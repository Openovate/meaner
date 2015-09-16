/* Required
-------------------------------*/
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
		
		if(!this.validate().isInteger(item.app_id)) {
			errors.app_id = this.INVALID_ID;
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
			callback(this.INVALID_PARAMETERS);
			return null;
		}
		
		//prepare
		item = this.validate().prepare(item);
		
		var search = this.database
			.search('app')
			.filterByAppId(item.app_id);
		
		callback(null, search);
		
		this.database.trigger('app-detail', search);
		
		return search;
	}
};