module.exports = function(grunt) {
	return {
		dist: {
			options: {
				sassDir: 'sass',
				cssDir: 'css',
				imagesDir: 'img',
				generatedImagesDir: 'img/sprites',
				outputStyle: 'expanded',
				relativeAssets: true,
				httpPath: '',
				noLineComments: false
			}
		}
	};
};