module.exports = function(job, done) {
	//need to have
	// item 	- auth/profile/file item
	var data		= job.data;
	var item 		= data.item;
	var controller	= job.controller || this;
	var results		= {};
	
	controller.sync()
	
	//check existence of profile
	.then(function(next) {
		this.model('auth').exists(item.profile_email, next);
	})
	
	//get profile, or try to
	.then(function(error, exists, next) {
		if(error) {
			return done(error.toString());	
		}
		
		//if exists, fail
		if(exists) {
			return done('Email exists.');
		}
		
		this.model('profile')
			.list()
			.process() 
			.filterByProfileEmail(item.profile_email)
			.getRow(next);
	})
	
	//process the profile
	.then(function(error, row, meta, next) {
		if(error) {
			return done(error.toString());	
		}
		
		//if there is a model
		if(row) {
			//just pass it
			return next(null, row);
		}
		
		//create the profile
		this.model('profile').create().process(item, function(error, model) {
			if(error) {
				return done(error.toString());
			}
			
			next(null, model.get());
		});
	})
	
	//process file
	.then(function(error, row, next) {
		if(error) {
			return done(error.toString());	
		}
		
		results.profile = row;
		
		if(!item.file_link) {
			return next(null, {});
		}
		
		//create the profile
		this.model('file').create().process({ 
			file_link: item.file_link, 
			file_type: 'main_profile'
		}, next.thread.bind(this, 'link-file'));
	})
	
	//link file
	.thread('link-file', function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.file = model.get();
		
		this.model('profile').linkFile({
			file_id		: results.file.file_id,
			profile_id	: results.profile.profile_id
		}, next);
	})
	
	//create auth
	.then(function(error, row, next) {
		if(error) {
			return done(error.toString());
		}
		
		this.model('auth').create().process(item, next);
	})
	
	//link auth
	.then(function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.auth = model.get();
		
		this.model('auth').linkProfile({
			auth_id		: results.auth.auth_id,
			profile_id	: results.profile.profile_id
		}, next);
	})
	
	//end
	.then(function(error, row, next) {
		if(error) {
			return done(error.toString());
		}
		
		done(null, results);
	});
};