module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat : {
			basic_and_extras : {
				files: {
					'dist/eyedraw.js': [ 'src/ED/Drawing.js', 'src/ED/Misc/**/*.js', 'src/ED/Doodles/**/*.js' ],
					'dist/oe-eyedraw.js': [ 'src/OEEyeDraw.js' ]
				}
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist : {
				files : {
					'dist/eyedraw.min.js' : [ 'dist/eyedraw.js' ],
					'dist/oe-eyedraw.min.js' : [ 'dist/oe-eyedraw.js' ]
				}
			}
		},
		qunit : {
			files : [ 'test/**/*.html' ]
		},
		jshint : {
			files : [ 'gruntfile.js', 'src/**/*.js', 'test/**/*.js' ],
			options : {
				// options here to override JSHint defaults
				globals : {
					jQuery : true,
					console : true,
					module : true,
					document : true
				}
			}
		},
		watch : {
			files : [ '<%= jshint.files %>' ],
			//tasks : [ 'jshint', 'qunit' ]
			tasks : [ 'concat', 'uglify' ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('test', [ 'jshint', 'qunit' ]);

	//grunt.registerTask('default', [ 'jshint', 'qunit', 'concat', 'uglify' ]);
	grunt.registerTask('default', [ 'concat', 'uglify' ]);

};