module.exports = function(job, done) {
	//need to have
	// item 	- profile item
	var data		= job.data;
	var item 		= data.item;
	var results		= { image: [] };
	
	this.sync()
	
	//update product
	.then(function(next) {
		this.model('profile')
			.update()
			.process(item, next); 
	})
	
	//file choice
	.then(function(error, model, meta, next) {
		if(error) {
			return done(error);
		}
		
		results.profile = model.get();
		
		//if no images, return
		if(!item.images || !item.images.length) {
			return done();
		}
			
		this.model('profile').unlinkAllFiles(
			item.profile_id, 
			['main_profile', 'profile_image'], 
			next);
	})
	
	//initiate loop
	.then(function(error, next) {
		next.thread('file-loop', 0);
	})
	
	//add the image one at a time
	.thread('file-loop', function(i, next) {
		if(i < item.images.length) {
			var file = item.images[i];
			
			file.file_type = 'profile_image';
			
			if(i === 0) {
				file.file_type = 'main_profile';
			}
			
			//1. Validate
			file.imageOnly = true;
			
			var errors = this.model('file')
				.create()
				.errors(file);
			
			if(Object.keys(errors).length) {
				return next.thread('file-loop', i + 1);
			}
			
			// 2. Process
			this.model('file')
				.create()
				.process(file, next.thread.bind(
					this, 
					'link-file',
					i));
			
			return;
		}
		
		next();
	})
	
	//link file
	.thread('link-file', function(i, error, model) {
		if(error) {
			return next.thread('file-loop', i + 1);
		}
		
		results.images.push(model.get())
		
		this.model('profile').linkFile({
			file_id		: model.file_id,
			product_id	: item.profile_id
		}, next.thread.bind(this, 'iterate', i));	
	})
	
	//iterate
	.thread('iterate', function(i, error, row, next) {
		next.thread('file-loop', i + 1);
	})
	
	//end
	.then(function(next) {
		done(null, item);
	});
};