module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		imagemin: {
			options: {
				optimizationLevel: 5
			},
			assets: {
				files: [{
					expand: true,
					cwd: 'assets/',
					src: ['*.{png,jpg,jpeg,gif}'],
					dest: 'assets/'
				}]
			}
		},
		less: {
			min: {
				options: {
					cleancss: true
				},
				files: {
					'css/main.css': 'css/main.less',
					'css/tumblr.css': 'css/tumblr.less'
				}
			}
		},
		watch: {
			less: {
				files: [
					'css/less/*',
					'css/*.less'
				],
				tasks: ['less']
			}
		}
	});

	// grunt plugins
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Tasks
	grunt.registerTask('default', ['less', 'watch']);

};
