/*jshint camelcase:false */
// Generated on 2013-12-18 using generator-closure 0.1.12
//
var compiler = require('superstartup-closure-compiler');
var _ = require('underscore');
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};


module.exports = function (grunt) {

  //
  //
  // Config basic parameters
  //
  //
  //
  var CONF = {
    // The path to the closure library
    closureLibrary: process.env.CLOSURE_PATH || 'app/closure-library',
    
    // The path to the closure linter.
    closureLinter: 'app/closure-linter/closure_linter',


    // define the path to the app
    appPath: 'app/js/',

    // the base file of your project. The full path will result by concatenating
    // appPath + bootstrapFile
    bootstrapFile: 'bootstrap.js',

    // The folder that contains all the externs files.
    externsPath: 'build/externs/',

    // define the main namespace of your app.
    entryPoint: 'CrunchJS',
    
    // The path to the installed bower components
    componentPath: 'app/components',

    // the compiled file
    destCompiled: 'app/jsc/engine.js',

    // The location of the source map
    sourceMap: 'app/jsc/sourcemap.js.map',

    // This string will wrap your code marked as %output%
    // Take care to edit the sourcemap path
    outputWrapper: '(function(){%output%}).call(this);' +
      '//@sourceMappingURL=app/jsc/sourcemap.js.map'

   
  };

  // the file globbing pattern for vendor file uglification.
  CONF.vendorFiles = [
      // all files JS in vendor folder
      CONF.appPath + '/vendor/*.js',
    ];
  //
  //
  // Start Gruntconfig
  //
  //
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  grunt.initConfig({

    jsdoc : {
        engine : {
            src: ['app/js/engine/*'], 
            options: {
                destination: 'doc/engine',
                configure:"./jsdocConf.json"
            }
        },
        game : {
            src: ['app/js/game/*', 'app/js/shared/*'], 
            options: {
                destination: 'doc/game',
                configure:"./jsdocConf.json"
            }
        }
    },

    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: [
          CONF.appPath + '/**/*.js'
        ],
      },
      test: {
        options: {
          livereload: true
        },
        files: [
          CONF.appPath + '/**/*.js',
          'test/**/*.js'
        ],
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0',
        keepalive: false,
      },
      app: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, './app'),
              mountFolder(connect, CONF.closureLibrary),
            ];
          },
        },
      },
      test: {
        options: {
          port: 4242,
          middleware: function(connect) {
            return [
              mountFolder(connect, './'),
              mountFolder(connect, CONF.closureLibrary),
            ];
          },
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      test: {
        path: 'http://localhost:<%= connect.test.options.port %>/test/'
      }
    },

    mocha: {
      all: {
        options: {
          run: true,
          ignoreLeaks: false,
          urls: [
            'http://localhost:<%= connect.test.options.port %>/test/index.html',
            'http://localhost:<%= connect.test.options.port %>/test/index.html?compiled=true',
            'http://localhost:<%= connect.test.options.port %>/test/index.html?unit=true'
          ]
        }
      }
    },


    //
    //
    //
    // Closure Tools Tasks
    //
    // Dependency & Compiling
    //
    //
    //
    closureDepsWriter: {
      options: {
        closureLibraryPath: CONF.closureLibrary
      },
      game: {
        options: {
          root_with_prefix: [
            '"' + CONF.appPath + ' ../../../js"',
            '"' + CONF.componentPath + ' ../../../components"'
          ]
        },
        src : CONF.appPath + '/bootstrap.js',
        dest: '' + CONF.appPath + 'deps.js'
      },
      bddTest: {
        options: {
          root_with_prefix: [
            '"test ../../../../../test"',
            '"' + CONF.appPath + ' ../../../js"',
            '"' + CONF.componentPath + ' ../../../components"'
          ]
        },
        dest: 'test/bdd/deps-test-bdd.js'
      },
      unitTest: {
        options: {
          root_with_prefix: [
            '"test ../../../../../test"',
            '"' + CONF.appPath + ' ../../../js"',
            '"' + CONF.componentPath + ' ../../../components"'
          ]
        },
        dest: 'test/unit/deps-test-tdd.js'
      }
    },
    closureBuilder: {
      options: {
        inputs: [CONF.appPath + CONF.bootstrapFile],
        closureLibraryPath: CONF.closureLibrary,
        compile: true,
        compilerFile: compiler.getPathSS(),
        compilerOpts: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          define: [
            '\'goog.DEBUG=false\'',
            '\'CrunchJS.DEBUG=true\'',
            '\'CrunchJS.DATA_SYNC_DEBUG=false\''
          ],
          warning_level: 'verbose',
          jscomp_off: ['checkTypes', 'fileoverviewTags'],
          closure_entry_point: CONF.entryPoint,
          summary_detail_level: 3,
          only_closure_dependencies: null,
          source_map_format: 'V3',
          externs: [CONF.externsPath + '*.js'],
          output_wrapper: CONF.outputWrapper,
          create_source_map: CONF.sourceMap,

        }
      },
      game: {
        src: [  
          CONF.appPath,
          CONF.closureLibrary,
          CONF.componentPath
        ],
        dest: 'temp/compiledGame.js',
      },
      debug: {
        options: {
          compilerFile: compiler.getPath()
        },
        src: [
          CONF.appPath,
          CONF.closureLibrary,
          CONF.componentPath
        ],
        dest: 'temp/compiled.debug.js'
      }
    },

    // clean, uglify and concat aid in building
    clean: {
      dist: ['temp'],
      server: 'temp',
      doc: ['doc/**/*', '!doc/engine/.git']
    },
    uglify: {
      vendorGame: {
        files: {
          'temp/vendorGame.js': CONF.vendorFiles
        }
      }
    },
    concat: {
      game: {
        src: ['temp/vendorGame.js', 'temp/compiledGame.js'],
        dest: CONF.destCompiled
      },
    },


    //
    //
    //
    // Optional boilerplate tasks
    //
    //
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'app/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          'app/styles/game.css': [
            'temp/styles/{,*/}*.css',
            'app/styles/{,*/}*.css'
          ]
        }
      }
    },

    // Linting tasks.

    closureLint: {
      app:{
        closureLinterPath : CONF.closureLinter,
        src: [
          'app/js/**'
        ],
        options: {
          stdout: true,
          strict: true
        }
      }
    },
    closureFixStyle: {
      app:{
        closureLinterPath : CONF.closureLinter,
        src: [
          'app/js/**'
        ],
        options: {
          stdout: true,
          strict: true
        }
      }
    },

  }); // end grunt.initConfig();


  //
  //
  // initConfig END
  //
  // Register tasks
  //
  //
  grunt.registerTask('server', function (target) {
    if (target === 'test') {
      return grunt.task.run([
        'clean:server',
        'connect:test',
        'open:test',
        'watch:test'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'connect:app',
      'open:server',
      'watch:livereload'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
          'clean:dist',
          'uglify:vendorGame',
          'closureBuilder:game',
          'concat:game',
        ]);

  grunt.registerTask('deps', function(target) {
    switch (target){
      default:
        grunt.task.run([
            'closureDepsWriter:game',
            'closureDepsWriter:bddTest',
            'closureDepsWriter:unitTest'
        ]);
        break;
    } 
  });

  grunt.registerTask('default', [
    'deps'
  ]);

  grunt.registerTask('lint', [
    'closureLint:app'
  ]);

  grunt.registerTask('fixstyle', [
    'closureFixStyle:app'
  ]);

  grunt.registerTask('doc', [
    'clean:doc',
    'jsdoc'
  ]);

  function overwriteCompilerOpts (opts) {
    _.each(opts, function(opt, name) {
      grunt.config('closureBuilder.options.compilerOpts.'+name, opt);
    });
  };

  function setBootstrapFile (file) {
    grunt.config('closureBuilder.options.inputs', [CONF.appPath+file]);
  }
  
};
