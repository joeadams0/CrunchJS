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

	if(typeof document != undefined){
		// create a renderer instance.
	    var renderer = PIXI.autoDetectRenderer(400, 300);
	 
	    // add the renderer view element to the DOM
	    document.body.appendChild(renderer.view);
	}

	var scene = new Moba.ExampleScene();

	world.addScene(scene);

	world.run();

};

var moba = new Moba.Core();
