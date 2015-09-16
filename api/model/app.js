/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	/**
	 * Factory for create
	 *
	 * @return object
	 */
	create: function() {
		return this.model('app/create');
	},
	
	/**
	 * Get profile by app access token
	 * Random function needed...
	 *
	 * @param string
	 * @param callback
	 * @return void
	 */
	getProfileByToken: function(token, callback) {
		callback = callback || function() {};
		
		this.sync()
		
		//get row
		.then(function(next) {
			this.database
				.search('app')
				.setColumns('profile.*', 'app.*')
				.innerJoinOn('app_profile', 'app_profile_app = app_id')
				.innerJoinOn('profile', 'app_profile_profile = profile_id')
				.filterByAppToken(token)
				.getRow(next);
		})
		
		//end
		.then(function(error, row, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			//success
			callback(null, row);
		});
	},
	
	/**
	 * Factory for detail
	 *
	 * @return object
	 */
	detail: function() {
		return this.model('app/detail');
	},
	
	/**
	 * Link app to Profile
	 *
	 * @param object
	 * @param function callback whenever it's done
	 * @return void
	 */
	linkProfile: function(item, callback) {
		callback = callback || function() {};
		
		this.sync()
		
		//insert
		.then(function(next) {
			this.database
				.model()
				.setAppProfileProfile(item.profile_id)
				.setAppProfileApp(item.app_id)
				.insert('app_profile', next);
		})
		
		//end
		.then(function(error, model, meta) {
			if(error) {
				return callback(error.toString());
			}
			
			//success
			callback(null, item);
				
			this.database.trigger('app-link-profile', item);
		});
	},
	
	/**
	 * Factory for list
	 *
	 * @return object
	 */
	list: function() {
		return this.model('app/list');
	},
	
	/**
	 * Check for app permissions
	 * 
	 * @param int
	 * @param int
	 * @param callback
	 * @return void
	 */
	permissions: function(app, profile, callback) {
		callback = callback || function() {};
		
		this.sync()
		
		//get row
		.then(function(next) {
			this.detail()	
				.process({ app_id: app })
				.innerJoinOn(
					'app_profile', 
					'app_profile_app = app_id')
				.filterByAppProfileProfile(profile)
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
	 * Factory for refresh
	 *
	 * @return object
	 */
	refresh: function() {
		return this.model('app/refresh');
	},
	
	/**
	 * Factory for remove
	 *
	 * @return object
	 */
	remove: function() {
		return this.model('app/remove');
	},
	
	/**
	 * Unlink app to Profile
	 *
	 * @param object
	 * @param function callback whenever it's done
	 * @return void
	 */
	unlinkProfile: function(item, callback) {
		callback = callback || function() {};
		
		this.sync()
		
		//remove
		.then(function(next) {
			this.database
				.model()
				.setAppProfileProfile(item.profile_id)
				.setAppProfileApp(item.app_id)
				.remove('app_profile', next);
		})
		
		//end
		.then(function(error, model, meta) {
			if(error) {
				return callback(error.toString());
			}
			
			//success
			callback(null, item);
				
			this.database.trigger('app-unlink-profile', item);
		});
	},
	
	/**
	 * Factory for update
	 *
	 * @return object
	 */
	update: function() {
		return this.model('app/update');
	}
};
