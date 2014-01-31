/**
 * @author Joe Adams
 */
goog.provide('Moba');
goog.provide('Moba.Core');

goog.require('CrunchJS');
goog.require('Moba.ExampleScene');
goog.require('Moba.ExampleSystem');
goog.require('Moba.ExampleSystem1');
goog.require('Moba.ExampleComp');
goog.require('Moba.ExampleComp1');

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

	var sys1 = new Moba.ExampleSystem1();

	var sys = new Moba.ExampleSystem();

	scene.addSystem(sys1);
	scene.addSystem(sys);

	var entity = scene.createEntity();

	var excomp = new Moba.ExampleComp();

	var excomp1 = new Moba.ExampleComp1();

	scene.addComponent(entity, excomp);
	scene.addComponent(entity, excomp1);

	world.run();

};

var moba = new Moba.Core();
