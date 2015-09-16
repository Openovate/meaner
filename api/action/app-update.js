/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL_NOT_EXISTS		: 'App does not exist',
	FAIL_PERMISSIONS	: 'You do not have permissions to update.',
	FAIL_VALIDATION 	: 'There are some errors on the form.',
	SUCCESS				: 'App successfully updated!',
	
	/* Properties
	-------------------------------*/
	title: 'Updating App',
	
	/* Construct
	-------------------------------*/
	constructor: function() {
		//set default roles no matter what
		this.data.roles = this.getRoles();
		
		//if it's a post
		if(this.request.method === 'POST') {
			return this.check();
		}
		
		this.sync()

		//get item
		.then(function(next) {
			this.item = { 
				app_id		: parseInt(this.params.id),
				profile_id	: this.me.profile_id };
			
			next();
		})
		
		//check permissions
		.then(function(next) {
			this.model('app').permissions(
				this.item.app_id, 
				this.item.profile_id, 
				next);
		})
		
		//get app
		.then(function(error, yes, next) {
			if(error) {
				return this.fail(error.toString(), '/app/list');
			}
			
			//if not permitted, fail
			if(!yes) {
				return this.fail(this.FAIL_PERMISSIONS, '/app/list');
			}
			
			this.model('app')
				.detail()
				.process(this.item)
				.getRow(next);
		})
		
		//end
		.then(function(error, row, meta, next) {
			if(error) {
				return this.fail(error.toString(), '/app/list');
			}

			//we are formatting this for handlebars
			this.data.roles = this.getRoles(row.app_permissions.split(','));
			
			this.data.item = row;
			
			this.output();
		});
	},
	
	/* Methods
	-------------------------------*/
	/**
	 * When the form is submitted
	 *
	 * @return void
	 */
	check: function() {
		this.sync()

		//get the item
		.then(function(next) {
			//add app
			this.item.app_id = parseInt(this.params.id);
			
			//set permissions		
			if(this.item.app_permissions instanceof Array) {
				this.item.app_permissions = this.item.app_permissions.join(',');
			}
			
			this.data.roles = this.getRoles(this.item.app_permissions.split(','));
			
			next();
		})
		
		//validate
		.then(function(next) {
			var errors = this.model('app')
				.update()
				.errors(this.item);
		
			//if there are errors, fail
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL_VALIDATION, errors, this.item);
			}
			
			this.job('app-update')({
				data: { item: this.item }
			}, next);
		})
		
		//end
		.then(function(error, row, next) {
			if(error) {
				return this.fail(error.toString(), {}, this.item);	
			}
			
			//success
			this.success(this.SUCCESS, '/app/list');
		});
	},
	
	/**
	 * Sets up the roles object
	 *
	 * @param array
	 * @return object
	 */
	getRoles: function(permissions) {
		permissions = permissions || [];
		
		var roles = this.controller.config('roles');
		
		//try not to use the global roles
		var label, role, max = 0, localRoles = {};
		//reset all the roles
		for(label in roles) {
			localRoles[label] = [];
			for(role in roles[label]) {
				localRoles[label].push({
					name		: role,
					title		: roles[label][role].title,
					description	: roles[label][role].description,
					checked		: permissions.indexOf(role) !== -1
				});
			}
		}
		
		return localRoles;
	}
};
