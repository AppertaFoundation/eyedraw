module.exports = function(grunt) {
	return {
		basic_and_extras : {
			files: {
				'dist/eyedraw.js': [
					'src/ED.js',
					'src/ED/Drawing.js',
					'src/ED/Doodle.js',
					'src/ED/Report.js',
					'src/ED/Checker.js',
					'src/ED/Controller.js',
					'src/ED/View.js',
					'src/ED/Drawing/**/*.js',
					'src/ED/Views/**/*.js',
					'src/ED/Misc/**/*.js',
					'src/ED/Doodles/**/*.js'
				],
				'dist/oe-eyedraw.js': [
					'src/OEEyeDraw.js'
				]
			}
		}
	}
};