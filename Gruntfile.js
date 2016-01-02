module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/jquery.circular.js"],
				dest: "dist/jquery.circular.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.circular.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.circular.js"],
				dest: "dist/jquery.circular.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
		    files: ['src/*', 'demo/*'],
		    tasks: ['default'],
             options: {
                  livereload: {
                    host: 'localhost',
                    port: 35729
                    
                    // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
                  }
             }
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["concat", "uglify"]);
	grunt.registerTask("default", ["jshint", "build"]);
	grunt.registerTask("travis", ["default"]);

};
