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
	database: require('../../controller').database,
    controller: require('../../controller'),
	
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
		
		if(!this.controller.validate().isInteger(item.profile_id)) {
			errors.profile_id = this.INVALID_ID;
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
		
		var search = this.database
			.search('profile')
			.innerJoinOn(
				'profile_file', 
				'profile_file_profile = profile_id')
			.innerJoinOn(
				'file', 
				'profile_file_file = file_id AND file_type = \'main_profile\'')
			.filterByProfileId(item.profile_id);
		
		if(item.public) {
			search.setColumns(
				'profile_id', 
				'profile_name',
				'profile_type',
				'profile_created',
				'file_link AS profile_image')
		} else {
			search.setColumns('profile.*', 'file_link AS profile_image')
		}
		
		callback(null, search);
		
		this.database.trigger('profile-detail', search);
		
		return search;
	}
};