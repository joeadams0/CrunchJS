/**
 * @author Joe Adams
 */
goog.provide("Moba");

goog.require("Engine");


/**
 * The Game Object
 *  
 * @constructor
 * 
 */
Moba = function(){

	// Create the engine
	this.engine = new Engine({
		webworker : false
	});

};