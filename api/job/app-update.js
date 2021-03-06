module.exports = function(job, done) {
	//need to have
	// item 	- app item
	var data		= job.data;
	var item 		= data.item;
	var results		= {};
	
	this.sync()
	
	// update
	.then(function(next) {
		this.model('app')
			.update()
			.process(item, next);
	})
	
	//end
	.then(function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.app = model.get();
		
		done(null, results);
	});
};