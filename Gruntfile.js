/*jshint camelcase:false */
// Generated on 2013-12-18 using generator-closure 0.1.12
//
var compiler = require('superstartup-closure-compiler');
var _ = require('underscore');
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var modules = [];
modules.push('blah:53');
var useModules = modules.join(' --module ');

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


    main : {

      // the base file of your project. The full path will result by concatenating
      // appPath + bootstrapFile
      bootstrapFile: 'main.js',

      // The folder that contains all the externs files.
      externsPath: 'build/externs/main/',

      // define the main namespace of your app.
      entryPoint: 'main',
      
      // The path to the installed bower components
      componentPath: 'app/components',

      // the compiled file
      destCompiled: 'app/jsc/game.js',

      // define the path to the app
      appPath: 'app/js/',

      // The location of the source map
      sourceMap: 'app/jsc/sourcemap.js.map',

      // This string will wrap your code marked as %output%
      // Take care to edit the sourcemap path
      outputWrapper: '(function(){%output%}).call(this);' +
        '//@sourceMappingURL=app/jsc/sourcemap.js.map'
    },

    sim : {

      // the base file of your project. The full path will result by concatenating
      // appPath + bootstrapFile
      bootstrapFile: '/game/simulation/simulation.js',

      // The folder that contains all the externs files.
      externsPath: 'build/externs/sim',

      // define the main namespace of your app.
      entryPoint: 'Simulation',
      
      // The path to the installed bower components
      componentPath: 'app/components',

      // the compiled file
      destCompiled: 'app/jsc/sim.js',

      // define the path to the app
      appPath: 'app/js/',

      // The location of the source map
      sourceMap: 'app/jsc/sourcemap.js.map',

      // This string will wrap your code marked as %output%
      // Take care to edit the sourcemap path
      outputWrapper: '(function(){%output%}).call(this);' +
        '//@sourceMappingURL=app/jsc/sourcemap.js.map'

    },
  };

  // the file globbing pattern for vendor file uglification.
  CONF.main.vendorFiles = [
      // all files JS in vendor folder
      CONF.main.appPath + '/vendor/main/*.js',
    ];


  // the file globbing pattern for vendor file uglification.
  CONF.sim.vendorFiles = [
      // all files JS in vendor folder
      CONF.sim.appPath + '/vendor/sim/*.js',
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
        hostname: 'localhost',
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
      main: {
        options: {
          root_with_prefix: [
            '"' + CONF.main.appPath + ' ../../../js"',
            '"' + CONF.main.componentPath + ' ../../../components"'
          ]
        },
        src : CONF.sim.appPath + '/main.js',
        dest: '' + CONF.main.appPath + 'deps.js'
      },
      sim : {
        src : [
          CONF.appPath+'engine/*.js',
          CONF.appPath+'engine/**/*.js',
          CONF.appPath+'shared/**.js',
          CONF.appPath+'game/**/*.js',
          '!'+ CONF.appPath+'game/systems/render/**/*.js'
        ],
        dest: '' + CONF.sim.appPath + 'deps-sim.js'
      },
      bddTest: {
        options: {
          root_with_prefix: [
            '"test ../../../../../test"',
            '"' + CONF.main.appPath + ' ../../../js"',
            '"' + CONF.main.componentPath + ' ../../../components"'
          ]
        },
        dest: 'test/bdd/deps-test-bdd.js'
      },
      unitTest: {
        options: {
          root_with_prefix: [
            '"test ../../../../../test"',
            '"' + CONF.main.appPath + ' ../../../js"',
            '"' + CONF.main.componentPath + ' ../../../components"'
          ]
        },
        dest: 'test/unit/deps-test-tdd.js'
      }
    },
    closureBuilder: {
      options: {
        inputs: [CONF.main.appPath + CONF.main.bootstrapFile],
        closureLibraryPath: CONF.closureLibrary,
        compile: true,
        compilerFile: compiler.getPathSS(),
        compilerOpts: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          define: [
            '\'goog.DEBUG=false\'',
            '\'CrunchJS.DEBUG=true\'',
            '\'CrunchJS.DATA_SYNC_DEBUG=false\''
          ],
          warning_level: 'verbose',
          jscomp_off: ['checkTypes', 'fileoverviewTags'],
          summary_detail_level: 3,
          only_closure_dependencies: null,
          source_map_format: 'V3'

        }
      },
      main: {
        src: [  
          CONF.main.appPath,
          CONF.closureLibrary,
          CONF.main.componentPath
        ],
        dest: 'temp/compiledMain.js',

        compilerOpts : {
          closure_entry_point: CONF.main.entryPoint,
          externs: [CONF.main.externsPath + '*.js'],
          output_wrapper: CONF.main.outputWrapper,
          create_source_map: CONF.main.sourceMap,
        }
      },
      sim : {
        src: [  
          CONF.sim.appPath,
          CONF.closureLibrary,
          CONF.sim.componentPath
        ],
        dest: 'temp/compiledSim.js',

        compilerOpts : {
          closure_entry_point: CONF.sim.entryPoint,
          externs: [CONF.sim.externsPath + '*.js'],
          output_wrapper: CONF.sim.outputWrapper,
          create_source_map: CONF.sim.sourceMap,
        }
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
      vendorMain: {
        files: {
          'temp/vendorMain.js': CONF.main.vendorFiles
        }
      },
      vendorSim : {
        files: {
          'temp/vendorSim.js': CONF.sim.vendorFiles
        }
      }
    },
    concat: {
      main: {
        src: ['temp/vendorMain.js', 'temp/compiledMain.js'],
        dest: CONF.main.destCompiled
      },
      sim: {
        src: ['temp/vendorSim.js', 'temp/compiledSim.js'],
        dest: CONF.sim.destCompiled
      }
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
          'app/styles/main.css': [
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

  grunt.registerTask('build', function(target){
    switch(target){
      // The simulation
      case 'sim':
        // Overwrite the default options with new ones for compiling the simulation
        overwriteCompilerOpts(grunt.config('closureBuilder.sim.compilerOpts'));
        setBootstrapFile(CONF.sim.bootstrapFile);

        grunt.task.run([
          'clean:dist',
          'uglify:vendorSim',
          'closureBuilder:sim',
          'concat:sim',
        ]);
        break;

      // Main - main window app
      case 'main':
        // Overwrite the default options with new ones for compiling the main window
        overwriteCompilerOpts(grunt.config('closureBuilder.main.compilerOpts'));
        setBootstrapFile(CONF.main.bootstrapFile);

        grunt.task.run([
          'clean:dist',
          'uglify:vendorMain',
          'closureBuilder:main',
          'concat:main',
        ]);
        break;

      default:
        grunt.task.run([
          'build:sim',
          'build:main',
          'clean:doc',
          'jsdoc'
        ]);
        break;
    }
    
  });

  grunt.registerTask('deps', function(target) {
    switch (target){
      case 'main':
        grunt.task.run([
          'closureDepsWriter:main'
        ]);
        break;
      case 'sim':
        grunt.task.run([
          'closureDepsWriter:sim'
        ]);
        break;

      default:
        grunt.task.run([
          'closureDepsWriter:main',
          'closureDepsWriter:sim'
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

  function overwriteCompilerOpts (opts) {
    _.each(opts, function(opt, name) {
      grunt.config('closureBuilder.options.compilerOpts.'+name, opt);
    });
  };

  function setBootstrapFile (file) {
    grunt.config('closureBuilder.options.inputs', [CONF.appPath+file]);
  }
  
};
