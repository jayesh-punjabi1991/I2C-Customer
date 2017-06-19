/**
 * @description Gruntfile that contains tasks to build, test and deploy a project.
 *
 * Configure all your tasks in the /tasks folder.
 *
 * For more help, see: http://gruntjs.com/getting-started
 */
module.exports = function(grunt) {
    'use strict';

    function loadConfig(path) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {
            cwd: path
        }).forEach(function(option) {
            key = option.replace(/\.js$/, '');
            object[key] = require(path + option);
        });

        return object;
    }

    // Initial config
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        cachebreaker: {
            dev: {
                options: {
                    match: [
                        'bootstrapper.js',
                        'app.css'
                    ],
                    position: 'filename',
                    replacement: function (){
                      var p = grunt.file.readJSON('package.json');
                      return p.version
                    },
                },
                files: {
                    src: ['temp/www/index.html']
                }
            },
            routedev: {
                options: {
                    match: [
                        'quotes.html','quotes-details.html','quotes-details-ar.html','orders.html','order-details-Accepted.html','order-details-CR.html','order-details-Generated.html','order-details-Rejected.html','order-details.html','dashboards.html','home.html','changeRequest.html','change-request-details.html','CRdetailsAccepted.html','CRdetailsPending.html','CRdetailsRejected.html'
                    ],
                    position: 'filename',
                    replacement: function (){
                      var p = grunt.file.readJSON('package.json');
                      return p.version
                    },
                },
                files: {
                    src: ['temp/www/scripts/bootstrapper.js']
                }
            }
        },
        filerev: {
          options: {
               encoding: 'utf8',
               algorithm: 'md5',
               length: 8
           },
           source: {
               files: [{
                 src: [
                     'dist/www/modules/**/*.js',
                     'dist/www/css/**/*.css',
                     'dist/www/modules/**/*.html'
                 ]
               }]
           }
        },
        useminPrepare: {
          html: {
            src:['dist/www/index.html','dist/www/modules/**/*.html']
          },
          options: {
            root: "./",
            dest: 'dist/www/'
          }
        },
        usemin: {
          html: ['dist/www/**/*.html'],
          css: ['dist/www/css/{,*/}*.css'],
          js: ['dist/www/modules/{,*/}*.js'],
          options: {
            assetsDirs: ['dist/www', 'dist/www/css', 'dist/www/modules'],
          }
        }
    };

    // Load tasks from tasks folder
    grunt.loadTasks('tasks');

    grunt.util._.extend(config, loadConfig('./tasks/options/'));

    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);
};
