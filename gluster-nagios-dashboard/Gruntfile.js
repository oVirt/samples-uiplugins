'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: ['src/js/*.js', 'test/spec/*.js'],
			options: {
				devel: true,
				globalstrict: true
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js'
			},
			unit_auto: {
				configFile: 'karma.conf.js',
				autoWatch: true,
				singleRun: false
			},
			coverage: {
				configFile: 'karma.conf.js',
				browsers: ['PhantomJS'],
				autoWatch: false,
				singleRun: true,
				reporters: ['progress', 'coverage'],
				preprocessors: {
					'src/js/*.js': ['coverage']
				},
				coverageReporter: {
					type: 'html',
					dir: 'test/out/coverage'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('validate', ['jshint']);
	grunt.registerTask('test:unit', ['karma:unit']);
	grunt.registerTask('test:unit_auto', ['karma:unit_auto']);
	grunt.registerTask('test:coverage', ['karma:coverage']);
}
