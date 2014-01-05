/**
 * @author Joe Adams
 */

goog.provide('SimulationConfig');

goog.require('ExampleSystem');

/**
 * Loads up all Systems for the Simulation
 * @param {Engine.Core} engine The current engine
 */
SimulationConfig = function(engine) {
	var exampleSystem = new ExampleSystem();

	engine.addSystem(exampleSystem);
};