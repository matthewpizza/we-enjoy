module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Tasks
	grunt.registerTask('default', ['less', 'watch']);

};
