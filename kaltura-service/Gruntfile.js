'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Clean Config
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            server: ['.tmp']
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    dest: 'dist/',
                    src: ['server.js', 'package.json', 'config/*']
                }]
            }
        },

        // Concurrent Config
        concurrent: {
            dist: [
                'copy:dist'
            ]
        },

        //publish to archiva
        webdav_deploy: {
            options: {
                release_path: '<%= pkg.archiva.url %>/<%= pkg.group %>/<%= pkg.name %>',
                baseDir: 'dist/'
            },
            release: {
                options: {
                    strategy : 'RELEASE'
                },
                files: {
                    src: ['dist/**/*', 'package.json','node_modules/**/*']
                }
            }
        }
    });

    grunt.registerTask('build', 'Build production ready assets and views.', [
        'clean:dist',
        'concurrent:dist',
        'copy:dist'
    ]);

};
