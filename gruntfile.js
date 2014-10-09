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
					'css/main.css': 'css/main.less'
				}
			}
		},
		watch: {
			less: {
				files: [
					'css/less/*',
					'css/main.less'
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
