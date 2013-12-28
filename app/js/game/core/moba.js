/**
 * @author Joe Adams
 */
goog.provide('Moba');

goog.require('Engine')


/**
 * The Game Object
 *  
 * @constructor
 * @this {Moba}
 */
Moba = function(){

	// Create the engine
	this.engine = new Engine.Core({
		webworker : false
	});

	console.log("Moba was created");

	this.engine.run();

};

var moba = new Moba();