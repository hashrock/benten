module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: [
                ['<%= my_js_files %>'],
                'package.json',
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            html: {
                files: 'public/**/*.html',
                tasks: ["jsbeautifier"],
                options: {
                    livereload: true
                }
            },
            css: {
                files: 'public/**/*.css',
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['<%= my_js_files %>'],
                tasks: ["jsbeautifier", "jshint"],
                options: {
                    livereload: true
                }
            }
        },
        jsbeautifier: {
            files: ['<%= my_src_files %>'],
            options: {
                config: ".jsbeautifyrc"
            }
        },
        my_js_files : ["public/*.js", "models/**/*.js", "routes/**/*.js", "app.js"],
        my_src_files : ["public/*.html","public/*.js", "models/**/*.js", "routes/**/*.js", "app.js"]
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', ['watch']);
};
