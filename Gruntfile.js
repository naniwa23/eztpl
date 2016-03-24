module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			src: 'src/*.js',
			options: {
				specs: 'test/*.spec.js'
			}
		},
		uglify: {
			options: {
				banner: '/* https://github.com/naniwa23/eztpl */',
			},
			eztpl: {
				src: 'src/eztpl.js',
				dest: 'dist/eztpl.min.js'
			}
		}
	});

	// Register tasks.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task.
	grunt.registerTask('default', ['jasmine', 'uglify']);
};