/**
 * @author Joe Adams
 */
goog.provide('Moba');
goog.provide('Moba.Core');

goog.require('Engine')
goog.require('Engine.WebWorkerChannel');
goog.require('Moba.SimpleRenderer');

/**
 * The Game Object
 *  
 * @constructor
 * @this {Moba}
 */
Moba.Core = function(){
	var simulation, 
		engine;



	engine = new Engine.Core({
		renderer:{}
	});

	if(!COMPILED)
		simulation = new Worker('/js/game/simulation/simulation-bootstrap.js');
	else
		simulation = new Worker('/jsc/sim.js');


	engine.setSimulation(simulation);

	this.sim = simulation;

	engine.addListener('message', function(event) {
		console.log(event);
	});

	engine.addSystem(new Moba.SimpleRenderer());
	
	engine.run();

	var entity = engine.createEntity();

	engine.addComponent(entity, {
		
		'__identifier' : 'renderable',

		'count' : 0
	});
};

var moba = new Moba.Core();
