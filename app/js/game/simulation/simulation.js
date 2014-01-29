/**
 * @author Joe Adams
 */

goog.provide('Simulation');

goog.require('CrunchJS');
goog.require('SimulationConfig');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');

/**
 * Creates a Simulation object in a web worker.
 * @class The Simulation Object. Only use in web workers.
 * @constructor
 * @this {Simulation}
 */
Simulation = function() {

	// Create the world
	this.world = new CrunchJS.World();

	goog.global.world = this.world;

	// Load the simulation
	SimulationConfig(this.world);

};


var sim = new Simulation();
