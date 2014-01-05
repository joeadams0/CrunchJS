/**
 * @author Joe Adams
 */
goog.provide('Moba');

goog.require('Engine')


/**
 * The Game Object
 *  
 * @constructor
 * @this {Moba}
 */
Moba = function(){
	var simulation;
	if(!COMPILED)
		simulation = new Worker('/js/game/simulation/simulation-bootstrap.js');
	else
		simulation = new Worker('/jsc/sim.js');

	simulation.onmessage = function(event) {
		console.log(event);
	};
};

var moba = new Moba();