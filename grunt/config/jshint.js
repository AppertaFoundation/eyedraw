module.exports = function(grunt) {
	return {
		files : [ 'gruntfile.js', 'src/**/*.js', 'test/**/*.js' ],
		options : {
			// options here to override JSHint defaults
			globals : {
				jQuery : true,
				console : true,
				module : true,
				document : true
			}
		}
	}
};