/* Required
-------------------------------*/
var time 	= require('eden-time')();
var file 	= require('eden-file');
var string 	= require('eden-string')();
var AWS 	= require('aws-sdk');

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_EMPTY		: 'Cannot be empty!',
	INVALID_SET			: 'Cannot be empty, if set',
	INVALID_FLOAT		: 'Should be a valid floating point',
	INVALID_INTEGER		: 'Should be a valid integer',
	INVALID_NUMBER		: 'Should be a valid number',
	INVALID_BOOL		: 'Should either be 0 or 1',
	INVALID_SMALL		: 'Should be between 0 and 9',
	UNKNOWN_EXTENSION	: 'unknown',
	UNKNOWN_TYPE		: 'application/octet-stream',
	IMAGE_ONLY			: 'File must be an image',
	
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	/**
	 * Returns errors if any
	 *
	 * @param object submitted item object
	 * @return object error object
	 */
	errors: function(item, errors) {
		errors = errors || {};
		
		//prepare
		item = this.validate().prepare(item);
		
		//REQUIRED
		
		// file_data			Required
		// OR
		// file_link			Required
		if(this.validate().isEmpty(item.file_data)
		&& this.validate().isEmpty(item.file_link)) {
			errors.file_data = this.INVALID_EMPTY;
			errors.file_link = this.INVALID_EMPTY;
		} else if(item.imageOnly && !this.validate().isEmpty(item.file_data)) {
			var data = decodeURIComponent(item.file_data);
		
			//data:mime;base64,data
			data = data.substr(5);
			
			var chunks 	= data.split(';base64,');
			var mime 	= chunks.shift();
			
			if(mime.indexOf('image/') !== 0) {
				errors.file_data = this.IMAGE_ONLY;
			}
		} else if(item.imageOnly && !this.validate().isEmpty(item.file_link)) {
			var ext = item.file_link.split('.').pop();
		
			var mime = this.types[ext] || '';
			
			if(mime.indexOf('image/') !== 0) {
				errors.file_link = this.IMAGE_ONLY;
			}
		}
		
		//OPTIONAL
		
		// file_flag
		if(this.validate().isSet(item.file_flag) 
		&& !this.validate().isSmall(item.file_flag)) {
			errors.file_flag = this.INVALID_SMALL;
		}
		
		return errors;
	},
	
	/**
	 * Processes the form
	 *
	 * @param object item object
	 * @param function callback whenever it's done
	 * @return void
	 */
	process: function(item, callback) {
		item 		= item 		|| {};
		callback 	= callback 	|| function() {};
		
		//prevent uncatchable error
		if(Object.keys(this.errors(item)).length) {
			return callback(this.INVALID_PARAMETERS);
		}
		
		//prepare
		item = this.validate().prepare(item);
		
		var config = this.controller.config('s3');
		
		if(item.file_data) {
			//upload
			this.upload(config, item.file_data, function(error, meta) {
				if(error) {
					return callback(error);
				}
				
				item.file_link = [
					config.host, 
					config.bucket, 
					meta.name + meta.extension]
				.join('/');
				
				item.file_mime = meta.mime;
				
				delete item.file_data;
				
				this.save(item, callback);
			}.bind(this));
			
			return;
		}
		
		//parse the file_link
		var ext = item.file_link.split('.').pop() || this.UNKNOWN_EXTENSION;
		item.file_mime = this.types[ext] || this.UNKNOWN_TYPE;
		
		this.save(item, callback);
	},
	
	save: function(item, callback) {
		//generate dates
		var created = time.toDate(new Date(), 'Y-m-d H:i:s');
		var updated = time.toDate(new Date(), 'Y-m-d H:i:s');
		
		//SET WHAT WE KNOW
		var model = this.database.model()
			// file_link			Required
			.setFileLink(item.file_link)
			// file_mime			Required
			.setFileMime(item.file_mime)
			// file_created
			.setFileCreated(created)
			// file_updated
			.setFileUpdated(updated);
		
		// file_path
		if(this.validate().isSet(item.file_path)) {
			model.setFilePath(item.file_path);
		}
		
		// file_flag
		if(this.validate().isSmall(item.file_flag)) {
			model.setFileFlag(item.file_flag);
		}
		
		// file_type
		if(this.validate().isSet(item.file_type)) {
			model.setFileType(item.file_type);
		}
		
		//what's left ?
		model.save('file', function(error, model) {
			if(error) {
				return callback(error.toString());
			}
			
			callback(error, model);
			
			this.database.trigger('file-create', model);
		}.bind(this));
	},
	
	/**
	 * Uploads an image given raw data and returns meta data
	 *
	 * @param string raw data
	 * @return object
	 */
	upload: function(config, data, callback) {
		//save the file
		var name	= string.uuid();
		var path 	= this.controller.path('upload') + '/' + name;
		
		data = decodeURIComponent(data);
		//data:mime;base64,data
		data = data.substr(5);
		
		var chunks 	= data.split(';base64,');
		var mime 	= chunks.shift();
		var ext 	= '.' + this.UNKNOWN_EXTENSION;
		
		//find out the extension
		for(var value in this.types) {
			if(this.types[value] === mime) {
				ext = '.'+value;
				break;
			}
		}
		
		data = chunks.join(';base64,');
		
		var buffer	= new Buffer(data, 'base64');
		
		//the new way
		AWS.config.update({ 
			accessKeyId		: config.token, 
			secretAccessKey	: config.secret });
		
		var s3 = new AWS.S3();
		
		s3.upload({
			Bucket		: config.bucket,
			Key			: name + ext,
			Body		: buffer,
			ContentType	: mime, 
			ACL			:'public-read'
		}, function(error, response) {
			if(error) {
				return callback(error.toString());
			}
			
			if(response instanceof Error) {
				return callback(response.toString());
			}
			
			callback(null, { name: name, extension: ext, mime: mime });
		});
	},
	
	/* Large Data
	-------------------------------*/
	types: {
		ai 			: 'application/postscript',	    	aif 		: 'audio/x-aiff',
		aifc 		: 'audio/x-aiff',					aiff 		: 'audio/x-aiff',
		asc 		: 'text/plain',				    	atom 		: 'application/atom+xml',
		au 			: 'audio/basic',				    avi 		: 'video/x-msvideo',
		bcpio 		: 'application/x-bcpio',		    bin 		: 'application/octet-stream',
		bmp 		: 'image/bmp',					    cdf 		: 'application/x-netcdf',
		cgm 		: 'image/cgm',					    class 		: 'application/octet-stream',
		cpio 		: 'application/x-cpio',		    	cpt 		: 'application/mac-compactpro',
		csh 		: 'application/x-csh',			    css 		: 'text/css',
		dcr 		: 'application/x-director',	    	dif 		: 'video/x-dv',
		dir 		: 'application/x-director',	    	djv 		: 'image/vnd.djvu',
		djvu 		: 'image/vnd.djvu',			    	dll 		: 'application/octet-stream',
		dmg 		: 'application/octet-stream',	    dms 		: 'application/octet-stream',
		doc 		: 'application/msword',		    	dtd 		: 'application/xml-dtd',
		dv 			: 'video/x-dv',				    	dvi 		: 'application/x-dvi',
		dxr 		: 'application/x-director',	    	eps 		: 'application/postscript',
		etx 		: 'text/x-setext',				    exe 		: 'application/octet-stream',
		ez 			: 'application/andrew-inset',	    gif 		: 'image/gif',
		gram 		: 'application/srgs',			    grxml 		: 'application/srgs+xml',
		gtar 		: 'application/x-gtar',		    	hdf 		: 'application/x-hdf',
		hqx 		: 'application/mac-binhex40',	    htm 		: 'text/html',
		html 		: 'text/html',					    ice 		: 'x-conference/x-cooltalk',
		ico 		: 'image/x-icon',				    ics 		: 'text/calendar',
		ief 		: 'image/ief',					    ifb 		: 'text/calendar',
		iges 		: 'model/iges',				    	igs 		: 'model/iges',
		jnlp 		: 'application/x-java-jnlp-file',  	jp2 		: 'image/jp2',
		jpe 		: 'image/jpeg',				    	jpeg 		: 'image/jpeg',
		jpg 		: 'image/jpg',				    	js 			: 'application/x-javascript',
		kar 		: 'audio/midi',				    	latex 		: 'application/x-latex',
		lha 		: 'application/octet-stream',	    lzh 		: 'application/octet-stream',
		m3u 		: 'audio/x-mpegurl',			    m4a 		: 'audio/mp4a-latm',
		m4b 		: 'audio/mp4a-latm',			    m4p 		: 'audio/mp4a-latm',
		m4u 		: 'video/vnd.mpegurl',			    m4v 		: 'video/x-m4v',
		mac 		: 'image/x-macpaint',			    man 		: 'application/x-troff-man',
		mathml 		: 'application/mathml+xml',	    	me 			: 'application/x-troff-me',
		mesh 		: 'model/mesh',				    	mid 		: 'audio/midi',
		midi 		: 'audio/midi',				    	mif 		: 'application/vnd.mif',
		mov 		: 'video/quicktime',			    movie 		: 'video/x-sgi-movie',
		mp2 		: 'audio/mpeg',				    	mp3 		: 'audio/mpeg',
		mp4 		: 'video/mp4',					    mpe 		: 'video/mpeg',
		mpeg 		: 'video/mpeg',				    	mpg 		: 'video/mpeg',
		mpga 		: 'audio/mpeg',				    	ms 			: 'application/x-troff-ms',
		msh 		: 'model/mesh',				    	mxu 		: 'video/vnd.mpegurl',
		nc 			: 'application/x-netcdf',		    oda 		: 'application/oda',
		ogg 		: 'application/ogg',			    pbm 		: 'image/x-portable-bitmap',
		pct 		: 'image/pict',				    	pdb 		: 'chemical/x-pdb',
		pdf 		: 'application/pdf',			    pgm 		: 'image/x-portable-graymap',
		pgn 		: 'application/x-chess-pgn',	    pic 		: 'image/pict',
		pict 		: 'image/pict',				    	png 		: 'image/png',
		pnm 		: 'image/x-portable-anymap',	    pnt 		: 'image/x-macpaint',
		pntg 		: 'image/x-macpaint',			    ppm 		: 'image/x-portable-pixmap',
		ppt 		: 'application/vnd.ms-powerpoint', 	ps 			: 'application/postscript',
		qt 			: 'video/quicktime',			    qti 		: 'image/x-quicktime',
		qtif 		: 'image/x-quicktime',			    ra 			: 'audio/x-pn-realaudio',
		ram 		: 'audio/x-pn-realaudio',		    ras 		: 'image/x-cmu-raster',
		rdf 		: 'application/rdf+xml',		    rgb 		: 'image/x-rgb',
		rm 			: 'application/vnd.rn-realmedia',  	roff 		: 'application/x-troff',
		rtf 		: 'text/rtf',					    rtx 		: 'text/richtext',
		sgm 		: 'text/sgml',					    sgml		: 'text/sgml',
		sh 			: 'application/x-sh',			    shar 		: 'application/x-shar',
		silo 		: 'model/mesh',				    	sit 		: 'application/x-stuffit',
		skd 		: 'application/x-koan',		    	skm 		: 'application/x-koan',
		skp 		: 'application/x-koan',		    	skt 		: 'application/x-koan',
		smi 		: 'application/smil',			    smil 		: 'application/smil',
		snd 		: 'audio/basic',				    so 			: 'application/octet-stream',
		spl 		: 'application/x-futuresplash',    	src 		: 'application/x-wais-source',
		sv4cpio 	: 'application/x-sv4cpio',		    sv4crc 		: 'application/x-sv4crc',
		svg 		: 'image/svg+xml',				    swf 		: 'application/x-shockwave-flash',
		t 			: 'application/x-troff',		    tar 		: 'application/x-tar',
		tcl 		: 'application/x-tcl',			    tex 		: 'application/x-tex',
		texi 		: 'application/x-texinfo',		    texinfo 	: 'application/x-texinfo',
		tif 		: 'image/tiff',				    	tiff 		: 'image/tiff',
		tr 			: 'application/x-troff',		    tsv 		: 'text/tab-separated-values',
		txt 		: 'text/plain',				    	ustar 		: 'application/x-ustar',
		vcd 		: 'application/x-cdlink',		    vrml 		: 'model/vrml',
		vxml 		: 'application/voicexml+xml',	    wav 		: 'audio/x-wav',
		wbmp 		: 'image/vnd.wap.wbmp',		    	wbmxl 		: 'application/vnd.wap.wbxml',
		wml 		: 'text/vnd.wap.wml',			    wmlc 		: 'application/vnd.wap.wmlc',
		wmls 		: 'text/vnd.wap.wmlscript',	    	wmlsc 		: 'application/vnd.wap.wmlscriptc',
		wrl			: 'model/vrml',				    	xbm 		: 'image/x-xbitmap',
		xht 		: 'application/xhtml+xml',		    xhtml 		: 'application/xhtml+xml',
		xls 		: 'application/vnd.ms-excel',	    xml 		: 'application/xml',
		xpm 		: 'image/x-xpixmap',			    xsl 		: 'application/xml',
		xslt 		: 'application/xslt+xml',		    xul 		: 'application/vnd.mozilla.xul+xml',
		xwd 		: 'image/x-xwindowdump',		    xyz 		: 'chemical/x-xyz',
		zip 		: 'application/zip' 
	}
};