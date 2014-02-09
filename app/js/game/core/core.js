/**
 * @author Joe Adams
 */
goog.provide('Moba');
goog.provide('Moba.Core');

goog.require('CrunchJS');
goog.require('Moba.ExampleScene');

/**
 * The Game Object
 *  
 * @constructor
 * @this {Moba}
 */
Moba.Core = function(){
	var simulation, 
		world;

	world = new CrunchJS.World();

	var scene = new Moba.ExampleScene();

	world.addScene(scene);

	world.run();

};

var moba = new Moba.Core();
