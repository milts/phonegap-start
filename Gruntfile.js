module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        emberTemplates: {
            compile: {
                options: {
                    preprocess: function(source) {
                        return source.replace(/\s+/g, ' ');
                    },
                    templateBasePath: /www\/templates\//
                },
                files: {
                    'www/js/templates.js': 'www/templates/**/*.hbs'
                }
            }
        },

        watch: {
            emberTemplates: {
                files: 'www/templates/**/*.hbs',
                tasks: ['emberTemplates']
            }
        }

//        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//            },
//            build: {
//                src: 'src/<%= pkg.name %>.js',
//                dest: 'build/<%= pkg.name %>.min.js'
//            }
//        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ember-templates');

    // Default task(s).
    grunt.registerTask('default', ['emberTemplates']);


    /*
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
    */

};