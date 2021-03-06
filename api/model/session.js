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
	 * Factory for access
	 *
	 * @return object
	 */
	access: function() {
		return this.model('session/access');
	},
	
	/**
	 * Get profile by access token
	 * Random function needed...
	 *
	 * @param string
	 * @param callback
	 * @return void
	 */
	getProfileByToken: function(token, callback) {
		callback = callback || function() {};
		
		this.sync()
		
		.then(function(next) {
			this.database
				.search('session')
				.setColumns('profile.*')
				.innerJoinOn(
					'session_auth', 
					'session_auth_session = session_id')
				.innerJoinOn(
					'auth_profile', 
					'auth_profile_auth = session_auth_auth')
				.innerJoinOn(
					'profile', 
					'auth_profile_profile = profile_id')
				.filterBySessionToken(token)
				.getRow(next);
		})
		
		.then(function(error, row, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(null, row);
		});
	},
	
	/**
	 * Factory for login
	 *
	 * @return object
	 */
	login: function() {
		return this.model('session/login');
	},
	
	/**
	 * Factory for logout
	 *
	 * @return object
	 */
	logout: function() {
		return this.model('session/logout');
	},
	
	/**
	 * Factory for request
	 *
	 * @return object
	 */
	request: function() {
		return this.model('session/request');
	}
};
