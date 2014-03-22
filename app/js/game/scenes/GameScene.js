/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Scenes.GameScene');

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
 * The Game Scene
 * @constructor
 * @class 
 */
CloseContact.Scenes.GameScene = function() {
	goog.base(this);

	/**
	 * The NetworkManager for the scene
	 * @type {CrunchJS.Internal.NetworkManager}
	 * @protected
	 */
	this._networkManager = new CrunchJS.Internal.NetworkManager(this);
};

goog.inherits(CloseContact.Scenes.GameScene, CrunchJS.Scene);

CloseContact.Scenes.GameScene.prototype.name = 'GameScene';

CloseContact.Scenes.GameScene.prototype.activate = function(data) {
	goog.base(this, 'activate', data);

	if(!CrunchJS.world.isSim())
		$('#desc').html('Welcome to Close Contact. On the map below, you can click on the grass tiles to move the player to that tile. The player cannot move onto or through the tree tiles. Once you have moved the player around some, open up a second browser window and load the same webpage. These pages will communicate to each other, so if you move the player on one page, it will move on the other. The first page is the host and it will sync the state with the second page. The any action taken on either page is automatically synced.');

	this._networkManager.activate();

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
		        lx: 600, ly:600
		      },
		      lensSize: {
		        width: 100,
		        height: 100
		      }
	    	})
		);

		/*this.addComponent(ent2, new CrunchJS.Components.Body({
			width : 3,
			height : 3
		}));*/

		var tiles = [
			[0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,0,0,0,1,0],
			[0,1,1,1,0,0,1,0,1,0],
			[0,1,1,0,0,1,1,0,1,0],
			[0,1,1,0,1,1,1,1,1,0],
			[0,1,1,0,1,1,1,0,1,0],
			[0,1,1,0,1,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0]
		];

		goog.array.forEach(tiles, function(row, y) {
			goog.array.forEach(row, function(tile,x) {

				var id = this.createEntity();

				this.addComponents(id, 
					new CrunchJS.Components.Transform({
						x : -45+x*10,
						y : -45+y*10,
						layer : 0x00000001
					}),
					new CrunchJS.Components.Body({
						width : 10,
						height : 10
					}),

					new CrunchJS.Components.RenderImage({
						image : 'grass.jpg'
					})
				);

				if(!tile){
					id = this.createEntity();

					this.addComponents(id, 
						new CrunchJS.Components.Transform({
							x : -45+x*10,
							y : -45+y*10,
							layer : 0x00000001
						}),
						new CrunchJS.Components.Body({
							width : 10,
							height : 10
						}),

						new CrunchJS.Components.RenderImage({
							image : 'tree.png'
						}),

						new CrunchJS.Components.Occupancy()
					);
				}

			}, this);
		},this);


		var ent2 = this.createEntity();

		this.addComponents(ent2, 
			new CrunchJS.Components.Transform({
				x : -35,
				y : -35,
				layer : 0x00000001
			}),

			new CrunchJS.Components.RenderImage({
		      image: 'warrior.png'
		    }),

		    new CrunchJS.Components.Body({
		    	width : 10,
		    	height : 10
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
				x : (data.x/600)*100-50,
				y : (data.y/600)*100-50
			};

			var dater = {
				id : ent2,
				coords : end,
				gridId : 1
			};

			setTimeout(function() {
				self.fireEvent(CrunchJS.Events.Move, dater);
			}, 200);

			self.fireEvent(CrunchJS.Events.SendNetworkCommand, {
				command : CrunchJS.Events.Move,
				data : dater
			});
		});
	}

};

CloseContact.Scenes.GameScene.prototype.deactivate = function() {
	if(!CrunchJS.world.isSim())
		$("#game").html('');

	this._networkManager.deactivate();
};