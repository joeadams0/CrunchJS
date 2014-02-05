/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleScene');

goog.require('CrunchJS.Scene');
goog.require('CrunchJS.Network.RemoteEngine.WWRemoteEngine');
goog.require('Moba.ExampleSystem');
goog.require('Moba.ExampleSystem1');
goog.require('Moba.ExampleComp');
goog.require('Moba.ExampleComp1');

/**
 * Creates an example scene
 * @constructor
 * @class An Example Scene
 * @extends {CrunchJS.Scene}
 */
Moba.ExampleScene = function() {
	goog.base(this);
};

goog.inherits(Moba.ExampleScene, CrunchJS.Scene);

/**
 * Set the name of the Scene
 * @type {String}
 */
Moba.ExampleScene.prototype.name = 'ExampleScene';

/**
 * Print a message when you activate
 * @param  {?Object} data The data if any
 */
Moba.ExampleScene.prototype.activate = function(data) {
	goog.base(this, "activate", data);

	if(!CrunchJS.world.isSim()){
		var sim;
		if(COMPILED){
			sim = new CrunchJS.Network.RemoteEngine.WWRemoteEngine('/jsc/game.js');
		}
		else{
			sim = new CrunchJS.Network.RemoteEngine.WWRemoteEngine('/js/game/simulation/simulation-bootstrap.js');
		}

		this.setSimulation(sim);

		var entity = this.createEntity();

		var excomp = new Moba.ExampleComp();

		var excomp1 = new Moba.ExampleComp1();

		this.addComponent(entity, excomp);
		this.addComponent(entity, excomp1);
	}

	var sys1 = new Moba.ExampleSystem1();

	var sys = new Moba.ExampleSystem();

	this.addSystem(sys1);
	this.addSystem(sys);
};

/**
 * Print a message when deactivating
 */
Moba.ExampleScene.prototype.deactivate = function() {
	goog.base(this, "deactivate");
};