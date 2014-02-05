/**
 * @author Joe Adams
 */

goog.provide('Simulation');

goog.require('CrunchJS');
goog.require('SimulationConfig');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');
goog.require('Moba.ExampleScene');
goog.require('Moba.ExampleSystem');
goog.require('Moba.ExampleSystem1');

/**
 * Creates a Simulation object in a web worker.
 * @class The Simulation Object. Only use in web workers.
 * @constructor
 * @this {Simulation}
 */
Simulation = function() {

	// Create the world
	var world = new CrunchJS.World();

	CrunchJS.world.log("I'M ALIVE", CrunchJS.LogLevels.DEBUG);
	
	var scene = new Moba.ExampleScene();

	world.addScene(scene);

	var sys1 = new Moba.ExampleSystem1();

	var sys = new Moba.ExampleSystem();

	scene.addSystem(sys1);
	scene.addSystem(sys);
	
	// Load the simulation
	SimulationConfig(scene);

};


var sim = new Simulation();
