module.exports = function(grunt) {
	return {
		files : [ '<%= jshint.files %>' ],
		//tasks : [ 'jshint', 'qunit' ]
		tasks : [ 'concat' ]
	}
};