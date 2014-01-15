/**
 * @author Joe Adams
 */
goog.provide('Moba');

goog.require('Engine')
goog.require('Engine.WebWorkerChannel');

/**
 * The Game Object
 *  
 * @constructor
 * @this {Moba}
 */
Moba = function(){
	var simulation, 
		engine;



	engine = new Engine.Core({
		renderer:{}
	});

	engine.run();

	if(!COMPILED)
		simulation = new Worker('/js/game/simulation/simulation-bootstrap.js');
	else
		simulation = new Worker('/jsc/sim.js');


	engine.setSimulation(simulation);

	this.sim = simulation;

	engine.simChannel.addListener('message', function(event) {
		console.log(event.data.data);
	});
};

var moba = new Moba();
