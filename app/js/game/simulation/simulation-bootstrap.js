/**
 * @author  Joe Adams
 */

/**
 * @ignore
 */
var CLOSURE_BASE_PATH = '/../../../closure-library/closure/goog/';
if(typeof COMPILED == "undefined"){
	var imp = importScripts;

	if (typeof String.prototype.startsWith != 'function') {
	  // see below for better implementation!
	  String.prototype.startsWith = function (str){
	    return this.indexOf(str) == 0;
	  };
	}

	// Hack to get around using uncompiled code in a web worker. For all of our own code, use base path, not closure path
	this.importScripts = function() {
		var args = arguments;
		for(var i = 0; i<args.length; i++){
			if(args[i].startsWith(CLOSURE_BASE_PATH + 'app/js/'))
				args[i] = args[i].replace(CLOSURE_BASE_PATH+'app/', '/');
		}
		imp.apply(this, args);
	};

	importScripts(
		'/js/vendor/buckets.js',
		CLOSURE_BASE_PATH+'bootstrap/webworkers.js',
	  	CLOSURE_BASE_PATH+'base.js',
	  	'/js/deps.js');	
}

goog.provide('SimulationBootstrap');

goog.require('Moba');
