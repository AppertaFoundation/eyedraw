module.exports = function(grunt) {
	return {
		basic_and_extras : {
			files: {
				'dist/eyedraw.js': [
					'src/ED/Drawing.js',
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