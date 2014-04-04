module.exports = function(grunt) {
	grunt.registerTask('build', 'The dist build task', [
		'concat',
		'uglify'
	]);
};