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
		return this.controller.model('profile/create');
	},
	
	/**
	 * Factory for detail
	 *
	 * @return object
	 */
	detail: function() {
		return this.controller.model('profile/detail');
	},
	
	/**
	 * Link file to profile
	 *
	 * @param object profile object
	 * @param function callback whenever it's done
	 * @return void
	 */
	linkFile: function(item, callback) {
		callback = callback || function() {};
		
		this.controller.sync(this)
		
		//insert
		.then(function(next) {
			this.database
				.model()
				.setProfileFileProfile(item.profile_id)
				.setProfileFileFile(item.file_id)
				.insert('profile_file', next);
		})
		
		//end
		.then(function(error, model, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(error, item);
			
			this.database.trigger('profile-link-file', item);
		});
	},
	
	/**
	 * Factory for list
	 *
	 * @return object
	 */
	list: function() {
		return this.controller.model('profile/list');
	},
	
	/**
	 * Factory for remove
	 *
	 * @return object
	 */
	remove: function() {
		return this.controller.model('profile/remove');
	},
	
	/**
	 * Unlink all Files to Profile
	 *
	 * @param object
	 * @param function callback whenever it's done
	 * @return void
	 */
	unlinkAllFiles: function(id, types, callback) {
		types		= types || [];
		callback 	= callback || function() {};
		
		this.controller.sync(this)
		
		//search for existing files
		.then(function(next) {
			var search = this.database.search('profile_file')
				.innerJoinOn('file', 'profile_file_file = file_id')
				.filterByProfileFileProfile(id);
			
			if(types && types.length) {
				var or = [], where = [];
				types.forEach(function(type) {
					where.push('file_type = ?');
					or.push(type);
				});
				
				or.unshift('(' + where.join(' OR ') + ')')
				
				search.addFilter.apply(search, or);
			}	
			
			search.getRows(next);
		})
		
		//enter file loop
		.then(function(error, rows, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			if(!rows.length) {
				return callback(null);
			}
			
			next.thread('file-loop', rows, 0);
		})
		
		//insert file one by one
		.thread('file-loop', function(rows, i, next) {
			if(i < rows.length) {
				model.unlinkFile({
					profile_id: id,
					file_id: rows[i].file_id
				}, next.thread.bind(this, 'file-remove', rows, i));
				
				return;
			}
			
			next();
		})
		
		//remove file
		.thread('file-remove', function(rows, i, error, item, next) {
			//ignore errors, just continue
			model.controller.model('file').remove().process({
				file_id: rows[i].file_id
			}, next.thread.bind(this, 'iterate', rows, i));
		})
		
		//iterate
		.thread('iterate', function(rows, i, error, model, next) {
			//ignore errors, just continue
			next.thread('file-loop', rows, i + 1);
		})
		
		//end
		.then(function(next) {
			callback(null);
		});
	},
	
	/**
	 * Unlink address to profile
	 *
	 * @param object profile object
	 * @param function callback whenever it's done
	 * @return void
	 */
	unlinkFile: function(item, callback) {
		callback = callback || function() {};
		
		this.controller.sync(this)
		
		//remove
		.then(function(next) {
			this.database
				.model()
				.setProfileFileProfile(item.profile_id)
				.setProfileFileFile(item.file_id)
				.remove('profile_file', next);
		})
		
		//end
		.then(function(error, model, meta, next) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(error, item);
			
			this.database.trigger('profile-unlink-file', item);
		});
	},
	
	/**
	 * Factory for update
	 *
	 * @return object
	 */
	update: function() {
		return this.controller.model('profile/update');
	}
};
