module.exports = function(grunt) {
	return {
		options : {
			banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		},
		dist : {
			files : {
				'dist/eyedraw.min.js' : [ 'dist/eyedraw.js' ],
				'dist/oe-eyedraw.min.js' : [ 'dist/oe-eyedraw.js' ]
			}
		}
	}
};