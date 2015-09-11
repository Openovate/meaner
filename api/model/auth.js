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
		return this.controller.model('auth/create');
	},
	
	/**
	 * Checks to see if slug exists
	 *
	 * @param slug
	 * @param function
	 * @param void
	 */
	exists: function(slug, callback) {
		callback = callback || function() {};
		
		this.controller.sync(this)
		
		//get total
		.then(function(next) {
			this.database
				.search('auth')
				.filterByAuthSlug(slug)
				.getTotal(next);
		})
		
		//end
		.then(function(error, total, next) {
			callback(error, total);
		});
	},
	
	/**
	 * Link auth to Profile
	 *
	 * @param object
	 * @param function callback whenever it's done
	 * @return void
	 */
	linkProfile: function(item, callback) {
		callback = callback || function() {};
		
		this.controller.sync(this)
		
		//insert
		.then(function(next) {
			this.database
				.model()
				.setAuthProfileProfile(item.profile_id)
				.setAuthProfileAuth(item.auth_id)
				.insert('auth_profile', next);
		})
		
		//end
		.then(function(error, model, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(null, item);
			
			this.database.trigger('auth-link-profile', item);
		});
	},
	
	/**
	 * Factory for remove
	 *
	 * @return object
	 */
	remove: function() {
		return this.controller.model('auth/remove');
	},
	
	/**
	 * Unlink auth to Profile
	 *
	 * @param object
	 * @param function callback whenever it's done
	 * @return void
	 */
	unlinkProfile: function(item, callback) {
		callback = callback || function() {};
		
		this.controller.sync(this)
		
		//remove
		.then(function(next) {
			this.database
				.model()
				.setAuthProfileProfile(item.profile_id)
				.setAuthProfileAuth(item.auth_id)
				.remove('auth_profile', next);
		})
		
		//end
		.then(function(error, model, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(error, item);
			
			this.database.trigger('auth-unlink-profile', item);
		});
	},
	
	/**
	 * Factory for update
	 *
	 * @return object
	 */
	update: function() {
		return this.controller.model('auth/update');
	}
};
