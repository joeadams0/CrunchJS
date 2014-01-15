/**
 * @author Joe Adams
 */

goog.provide('Simulation');

goog.require('Engine');
goog.require('SimulationConfig');
goog.require('Engine.WebWorkerChannel');

/**
 * Creates a Simulation object in a web worker.
 * @class The Simulation Object. Only use in web workers.
 * @constructor
 * @this {Simulation}
 */
Simulation = function() {

	// Create the engine
	this.engine = new Engine.Core();

	goog.global.engine = this.engine;

	// Load the simulation
	SimulationConfig(this.engine);


	this.engine.run();
};


var sim = new Simulation();
