module.exports = function(grunt) {
	return {
		test: {
			options: {
				hostname: '127.0.0.1',
				port: 1337,
				base: './',
				directory: './',
				keepalive: true
			}
		}
	};
};