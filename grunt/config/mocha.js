module.exports = function(grunt) {
	return {
		options: {
			run: true,
			reporter: 'Spec',
			log: false
		},
		src: [
			'tests/js/runners/**/*.html',
			'!**/index.html',
		]
	};
};