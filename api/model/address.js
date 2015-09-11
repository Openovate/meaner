/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	/* Properties
	-------------------------------*/
	controller	: require('../controller'),
	database	: require('../controller').database,
	
	/* Methods
	-------------------------------*/
	/**
	 * Factory for create
	 *
	 * @return object
	 */
	create: function() {
		return this.controller.model('address/create');
	},
	
	/**
	 * Factory for detail
	 *
	 * @return object
	 */
	detail: function() {
		return this.controller.model('address/detail');
	},
	
	/**
	 * Factory for list
	 *
	 * @return object
	 */
	list: function() {
		return this.controller.model('address/list');
	},
	
	/**
	 * Checks to see if someone has 
	 * permissions to modify the address
	 *
	 * @param int
	 * @param int
	 * @param function
	 * @return void
	 */
	permissions: function(address, profile, callback) {
		callback = callback || function() {};
		
		this.controller.sync(this)
		
		//get row
		.then(function(next) {
			this.detail()	
				.process({ address_id: address })
				.innerJoinOn(
					'profile_address', 
					'profile_address_address = address_id')
				.filterByProfileAddressProfile(profile)
				.getRow(next);
		})
		
		//end
		.then(function(error, row, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			if(!row) {
				return callback(null, false);
			}
			
			//success
			callback(null, true);
		});
	},
	
	/**
	 * Factory for remove
	 *
	 * @return object
	 */
	remove: function() {
		return this.controller.model('address/remove');
	},
	
	/**
	 * Factory for update
	 *
	 * @return object
	 */
	update: function() {
		return this.controller.model('address/update');
	}
};
