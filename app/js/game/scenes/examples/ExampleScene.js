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
goog.require('CrunchJS.Systems.RenderingSystem');
goog.require('CrunchJS.Components.Transform');
goog.require('CrunchJS.Components.RenderImage');
goog.require('CrunchJS.Components.OccupancyGrid');
goog.require('CrunchJS.Components.Transform');
goog.require('CrunchJS.Components.Body');
goog.require('CrunchJS.Components.Occupancy');

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

	// If it is the sim
	if(CrunchJS.world.isSim()){
	}
	// If it is the main window
	else{
		var sim;
		if(COMPILED){
			sim = new CrunchJS.Network.RemoteEngine.WWRemoteEngine('/jsc/game.js');
		}
		else{
			sim = new CrunchJS.Network.RemoteEngine.WWRemoteEngine('/js/game/simulation/simulation-bootstrap.js');
		}

		this.setSimulation(sim);

		var entity = this.createEntity();

		this.setEntityName('master', entity);

		this.addComponent(entity, new CrunchJS.Components.Transform(0,0));
		this.addComponent(entity, new CrunchJS.Components.OccupancyGrid(10,10,3,3));

		var ent2 = this.createEntity();

		this.addComponent(ent2, new CrunchJS.Components.Transform(-15,-15));
		this.addComponent(ent2, new CrunchJS.Components.Body(7,7));
		this.addComponent(ent2, new CrunchJS.Components.Occupancy(false, true));

	}

};

/**
 * Print a message when deactivating
 */
Moba.ExampleScene.prototype.deactivate = function() {
	goog.base(this, "deactivate");
};
