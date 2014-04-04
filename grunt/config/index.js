module.exports = function(grunt) {
	return {
		pkg: grunt.file.readJSON('package.json'),
		concat: require('./concat')(grunt),
		jshint: require('./jshint')(grunt),
		qunit: require('./qunit')(grunt),
		uglify: require('./uglify')(grunt),
		watch: require('./watch')(grunt)
	};
};