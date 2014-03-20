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
goog.require('CrunchJS.Systems.PathfindingSystem');
goog.require('CrunchJS.Systems.PathMovementSystem');

// Comps
goog.require('CrunchJS.Components.Transform');
goog.require('CrunchJS.Components.RenderImage');
goog.require('CrunchJS.Components.Camera');
goog.require('CrunchJS.Components.OccupancyGrid');
goog.require('CrunchJS.Components.Body');
goog.require('CrunchJS.Components.Occupancy');
goog.require('CrunchJS.Components.PathQuery');
goog.require('CrunchJS.Components.Path');

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
		CrunchJS.Components.RenderImage,
		CrunchJS.Components.Camera,
		CrunchJS.Components.PathQuery,
		CrunchJS.Components.Path
	];

	goog.array.forEach(comps, function(comp) {
		this.registerComponent(comp)
	}, this);


	// If it is the sim
	if(CrunchJS.world.isSim()){
		
		var occSys = new CrunchJS.Systems.OccupancyGridSystem(),
			pathSys = new CrunchJS.Systems.PathfindingSystem(),
			pathMoveSys = new CrunchJS.Systems.PathMovementSystem();

		this.addSystem(occSys);
		this.addSystem(pathSys);
		this.addSystem(pathMoveSys);

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

		this.addComponents(entity, 
			new CrunchJS.Components.Transform({
				layer : 0x00000001
			}),
			new CrunchJS.Components.OccupancyGrid({
				width : 10,
				height : 10,
				tileWidth : 10,
				tileHeight : 10
			}),
			new CrunchJS.Components.Camera({
		      isActive: true,
		      screenSpace: {
		        ux: 0, uy: 0,
		        lx: 900, ly:600
		      },
		      lensSize: {
		        width: 100,
		        height: 100
		      }
	    	})
		);

		var ent2 = this.createEntity();

		this.addComponents(ent2, 
			new CrunchJS.Components.Transform({
				x : -45,
				y : -45,
				layer : 0x00000001
			}),

			new CrunchJS.Components.RenderImage({
		      image: 'star-on.png'
		    }),

		    new CrunchJS.Components.Body({
		    	width : 10,
		    	height : 10
		    })
		);

		/*this.addComponent(ent2, new CrunchJS.Components.Body({
			width : 3,
			height : 3
		}));*/

		var ent3 = this.createEntity();

		this.addComponents(ent3, 
			new CrunchJS.Components.Transform({
				x : -5,
				y : -5,
				layer : 0x00000001
			}),
			new CrunchJS.Components.Body({
				width : 10,
				height : 10
			}),
			new CrunchJS.Components.Occupancy(),

			new CrunchJS.Components.RenderImage({
				image : 'rock.png'
			})
		);

		ent3 = this.createEntity();

		this.addComponents(ent3, 
			new CrunchJS.Components.Transform({
				x : -5,
				y : -15,
				layer : 0x00000001
			}),
			new CrunchJS.Components.Body({
				width : 10,
				height : 10
			}),
			new CrunchJS.Components.Occupancy(),

			new CrunchJS.Components.RenderImage({
				image : 'rock.png'
			})
		);

		ent3 = this.createEntity();

		this.addComponents(ent3, 
			new CrunchJS.Components.Transform({
				x : -5,
				y : -25,
				layer : 0x00000001
			}),
			new CrunchJS.Components.Body({
				width : 10,
				height : 10
			}),
			new CrunchJS.Components.Occupancy(),

			new CrunchJS.Components.RenderImage({
				image : 'rock.png'
			})
		);

		ent3 = this.createEntity();

		this.addComponents(ent3, 
			new CrunchJS.Components.Transform({
				x : -5,
				y : 5,
				layer : 0x00000001
			}),
			new CrunchJS.Components.Body({
				width : 10,
				height : 10
			}),
			new CrunchJS.Components.Occupancy(),

			new CrunchJS.Components.RenderImage({
				image : 'rock.png'
			})
		);

		ent3 = this.createEntity();

		this.addComponents(ent3, 
			new CrunchJS.Components.Transform({
				x : -15,
				y : 5,
				layer : 0x00000001
			}),
			new CrunchJS.Components.Body({
				width : 10,
				height : 10
			}),
			new CrunchJS.Components.Occupancy(),

			new CrunchJS.Components.RenderImage({
				image : 'rock.png'
			})
		);

		ent3 = this.createEntity();

		this.addComponents(ent3, 
			new CrunchJS.Components.Transform({
				x : -25,
				y : 5,
				layer : 0x00000001
			}),
			new CrunchJS.Components.Body({
				width : 10,
				height : 10
			}),
			new CrunchJS.Components.Occupancy(),

			new CrunchJS.Components.RenderImage({
				image : 'rock.png'
			})
		);


		var sys = new CrunchJS.Systems.RenderingSystem({});

		this.addSystem(sys);

		var self = this;

		this.addEventListener(CrunchJS.Events.Move, function(data) {
			var transform = self.getComponent(data.id, 'Transform');

			self.addComponent(data.id, new CrunchJS.Components.PathQuery({
				start : {
					x : transform.x,
					y : transform.y
				},
				end : data.coords,
				gridId : data.gridId
			}));
		});

		this.addEventListener('click', function(data) {
			var end = {
				x : (data.x/900)*100-50,
				y : (data.y/600)*100-50
			};

			var dater = {
				id : ent2,
				coords : end,
				gridId : 1
			};

			self.fireEvent(CrunchJS.Events.Move, dater);

			self.fireEvent(CrunchJS.Events.SendNetworkCommand, {
				command : CrunchJS.Events.Move,
				data : dater
			});
		});
	}

};

/**
 * Print a message when deactivating
 */
Moba.ExampleScene.prototype.deactivate = function() {
	goog.base(this, "deactivate");
};
