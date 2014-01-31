/**
 * @author Joe Adams
 */

goog.provide('Simulation');

goog.require('CrunchJS');
goog.require('SimulationConfig');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');
goog.require('Moba.ExampleScene');

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
	
	// Load the simulation
	SimulationConfig(scene);

};


var sim = new Simulation();
