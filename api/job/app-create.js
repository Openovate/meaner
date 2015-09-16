module.exports = function(job, done) {
	//need to have
	// item 	- app item
	// profile_id
	var data		= job.data;
	var item 		= data.item;
	var results		= {};
	
	this.sync()
	
	// create app
	.then(function(next) {
		this.model('app')
			.create()
			.process(item, next);
	})
	
	//link app to profile
	.then(function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.app = model.get();
		
		//now link auth and profile
		this.model('app').linkProfile({
			app_id		: model.app_id,
			profile_id	: data.profile_id
		}, next);
	})
	
	//end
	.then(function(error, item, next) {
		if(error) {
			return done(error.toString());
		}
		
		done(null, results);
	});
};