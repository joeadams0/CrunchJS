/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleScene');

goog.require('goog.array');

goog.require('CrunchJS.Scene');
goog.require('CrunchJS.Network.RemoteEngine.WWRemoteEngine');

// Systems
goog.require('CrunchJS.Systems.RenderingSystem');
goog.require('CrunchJS.Systems.OccupancyGridSystem');

// Comps
goog.require('CrunchJS.Components.Transform');
goog.require('CrunchJS.Components.RenderImage');
goog.require('CrunchJS.Components.OccupancyGrid');
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

	// Register all of the components so they have the same index no matter if they are in the webworker or the main window. Just add the constructor to this array
	var comps = [
		CrunchJS.Components.Transform,
		CrunchJS.Components.Body,
		CrunchJS.Components.OccupancyGrid,
		CrunchJS.Components.Occupancy,
		CrunchJS.Components.RenderImage
	];
	goog.array.forEach(comps, function(comp) {
		this.registerComponent(comp)
	}, this);


	// If it is the sim
	if(CrunchJS.world.isSim()){
		
		var sys = new CrunchJS.Systems.OccupancyGridSystem();

		this.addSystem(sys);

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

		this.addComponent(entity, new CrunchJS.Components.Transform({
			layer : 0x00000001
		}));

		this.addComponent(entity, new CrunchJS.Components.OccupancyGrid({
			width : 10,
			height : 10,
			tileWidth : 3,
			tileHeight :3
		}));

		var ent2 = this.createEntity();

		this.addComponent(ent2, new CrunchJS.Components.Transform({
			x : -15,
			y : -15,
			layer : 0x00000001

		}));

		// this.addComponent(ent2, new CrunchJS.Components.RenderImage('star-on.png'));


		this.addComponent(ent2, new CrunchJS.Components.Body({
			width : 3,
			height : 3
		}));
		
		var occ = new CrunchJS.Components.Occupancy();
		this.addComponent(ent2, occ);


		// var sys = new CrunchJS.Systems.RenderingSystem({});

		// this.addSystem(sys);
	}

};

/**
 * Print a message when deactivating
 */
Moba.ExampleScene.prototype.deactivate = function() {
	goog.base(this, "deactivate");
};
