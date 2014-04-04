module.exports = function(grunt) {
	grunt.registerTask('test', 'The test task', [
		'jshint',
		'qunit'
	]);
};