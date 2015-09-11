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
		
		if(this.controller.validate().isEmpty(item.auth_id)) {
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
		item = this.controller.validate().prepare(item);
		
		//remove the tokens associated with this user
		var search = this.database
			.search('session')
			.innerJoinOn('session_auth', 'session_auth_session = session_id')
			.filterBySessionAuthAuth(item.auth_id);
		
		if(item.session_token) {
			search.addFilter('session_token = ? OR session_status = ?', item.session_token, 'PENDING');
		}
		
		search.getCollection(function(error, collection) {
			if(error) {
				return callback(error.toString());
			}
			
			if(!error) {
				collection
				.remove('session_auth', function() {})
				.remove('session', function() {});	
			}
			
			callback(error, collection);
			
			this.database.trigger('user-logout', item);		
		}.bind(this));
	}
};
