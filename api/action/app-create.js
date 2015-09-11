/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports  = {
    /* Constants
    -------------------------------*/
    FAIL_VALIDATION 	: 'There are some errors on the form.',
    SUCCESS				: 'App successfully created!',

    /* Properties
    -------------------------------*/
    title: 'Create an App',
	
	/* Construct
    -------------------------------*/
	constructor: function() {
		//set default roles no matter what
		this.data.roles = this.getRoles();
		
		//if it's a post
		if(this.request.method === 'POST') {
			return this.check();
		}
	
		//Just load the page
		return this.output();
	},
	
    /* Methods
    -------------------------------*/
    /**
     * When the form is submitted
	 *
	 * @return void
	 */
	check: function() {
		//set the body
		this.then(function(next) {
			//add profile_id
			this.item.profile_id = this.me.profile_id;
			
			//add permissions
			if(this.item.app_permissions instanceof Array) {
				this.item.app_permissions = this.item.app_permissions.join(',');
				
				//reset the roles
				this.data.roles = this.getRoles(this.item.app_permissions.split(','));
			}
			
			next();
		})
		
		//validate
		.then(function(next) {
			//get errors
			var errors = this.controller
				.model('app')
				.create()
				.errors(this.item);
			
			//if there are errors
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL_VALIDATION, errors, this.item);
			}
			
			next();
		})
		
		// process
		.then(function(next) {
			this.controller.job('app-create')({
				data: {
					item		: this.item,
					profile_id	: this.item.profile_id
				}
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
