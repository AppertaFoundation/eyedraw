module.exports = function(grunt) {
	return {
		concat: {
			files : [ '<%= jshint.files %>' ],
			//tasks : [ 'jshint', 'qunit' ]
			tasks : [ 'concat' ]
		},
		sass: {
			files: 'assets/sass/**/*.scss',
			tasks: ['compass:dist'],
			options: {
				// livereload: true
			}
		}
	}
};