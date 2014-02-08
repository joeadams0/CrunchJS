/**
 * @author Joe Adams
 */
goog.provide('Moba');
goog.provide('Moba.Core');

goog.require('CrunchJS');
goog.require('Moba.ExampleScene');
goog.require('box2d.World');

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

	if(!world.isSim()){
		var worldAABB = new box2d.AABB();
		worldAABB.minVertex.Set(-1000, -1000);
		worldAABB.maxVertex.Set(1000, 1000);
		var gravity = new box2d.Vec2(0, 300);
		var doSleep = true;
		window.phys = new box2d.World(worldAABB, gravity, doSleep); 
		console.log(window.phys);
	}

	var scene = new Moba.ExampleScene();

	world.addScene(scene);

	world.run();

};

var moba = new Moba.Core();
