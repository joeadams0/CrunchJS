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

	var simpleSystem = {
		update : function(frame) {
			if(frame.id%5 ==0)
				console.log("Simple System Update: ", frame.id);
		},

		__identifier : "simpleSystem"

	};

	this.engine.addSystem(simpleSystem);

	this.engine.run();

};

var moba = new Moba();