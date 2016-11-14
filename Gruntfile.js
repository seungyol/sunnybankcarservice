//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {

  // All upfront config goes in a massive nested object.
  grunt.initConfig({
    // You can set arbitrary key-value pairs.
    distFolder: 'dist',
    // You can also set the value of a key as parsed JSON.
    // Allows us to reference properties we declared in package.json.
    pkg: grunt.file.readJSON('package.json'),
    // Grunt tasks are associated with specific properties.
    // these names generally match their npm package name.
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					"jQuery": false,
                    "$": false,
                    "angular" : false
				},
			},
			uses_defaults: ['app/app.module.js','app/directive/*.js','app/factory/*.js','app/filter/*.js','app/login/*.js','app/customer/*.js','app/invoice/*.js'
             ,'app/partinvoice/*.js','app/settlement/*.js','app/user/*.component.js']
		},
		ngAnnotate: {
				options: {
						singleQuotes: true
				},
				app: {
						files: {
								'dist/main-safe.js': ['dist/main.js']
						}
				}
		},
		
    concat: {
      // Specify some options, usually specific to each plugin.
      options: {
        // Specifies string to be inserted between concatenated files.
        separator: ';'
      },
      // 'dist' is what is called a "target."
      // It's a way of specifying different sub-tasks or modes.
      dist: {
        // The files to concatenate:
        // Notice the wildcard, which is automatically expanded.
        src: ['app/app.module.js','app/directive/*.js','app/factory/*.js','app/filter/*.js','app/login/*.js','app/customer/*.js','app/invoice/*.js'
             ,'app/partinvoice/*.js','app/settlement/*.js','app/user/*.component.js'],
        // The destination file:
        // Notice the angle-bracketed ERB-like templating,
        // which allows you to reference other properties.
        // This is equivalent to 'dist/main.js'.
        dest: '<%= distFolder %>/main.js'
        // You can reference any grunt config property you want.
        // Ex: '<%= concat.options.separator %>' instead of ';'
      }
    },
		uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/main-safe.js',
        dest: 'dist/main.min.js'
      }
    }		
  }); // The end of grunt.initConfig

  // We've set up each task's configuration.
  // Now actually load the tasks.
  // This will do a lookup similar to node's require() function.
  grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-jshint');
  // Register our own custom task alias.
  grunt.registerTask('default', ['jshint','concat','ngAnnotate','uglify']);
};