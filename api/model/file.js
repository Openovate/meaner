/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	/* Properties
	-------------------------------*/
	controller: require('../controller'),
	
	/* Methods
	-------------------------------*/
	/**
	 * Factory for create
	 *
	 * @return object
	 */
	create: function() {
		return this.controller.model('file/create');
	},
	
	/**
	 * Factory for detail
	 *
	 * @return object
	 */
	detail: function() {
		return this.controller.model('file/detail');
	},
	
	/**
	 * Factory for list
	 *
	 * @return object
	 */
	list: function() {
		return this.controller.model('file/list');
	},
	
	/**
	 * Factory for remove
	 *
	 * @return object
	 */
	remove: function() {
		return this.controller.model('file/remove');
	}
};
