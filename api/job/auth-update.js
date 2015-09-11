module.exports = function(job, done) {
	//need to have
	// item 	- auth/profile item
	var data		= job.data;
	var item 		= data.item;
	var controller	= job.controller || this;
	var results		= {};
	
	controller.sync()
	
	//process the profile
	.then(function(next) {
		this.model('profile').update().process(item, next);
	})
	
	//process the auth
	.then(function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.profile = model.get();
		
		this.model('auth').update().process(item, next);
	})
	
	//end
	.then(function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.auth = model.get();
		
		done(null, results);
	});
};