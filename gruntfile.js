module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            modules: ''
        },
        bower: {
            options: {
                cleanBowerDir: false,
                cleanTargetDir: true,
                layout: 'byComponent',
                targetDir: './lib'
            },
            install: {
            }
        },
        concat: {
            app: {
                options: {
                    banner: '<%= meta.modules %>\n'
                },
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.app.dest %>']
                }
            }
        },
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.spec.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            watch: {
                background: true
            },
            continuous: {
                singleRun: true
            }
        },
        plato: {
            report: {
                files: {
                    'logs/plato': ['src/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-plato');

    grunt.registerTask('validate', 'Validate standards', function () {
        grunt.task.run('jshint');
    });

    grunt.registerTask('build', 'Create minified script files', function () {
        grunt.task.run('bower');
        grunt.task.run('concat');
        grunt.task.run('uglify');
    });

    grunt.registerTask('test', 'Run Tests', function () {
        grunt.task.run('karma:continuous');
        grunt.task.run('plato');
    });

    grunt.registerTask('default', ['validate', 'bower', 'build', 'test']);

};