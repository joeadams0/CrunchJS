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
goog.require('CrunchJS.Components.Viewport');

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
		CrunchJS.Components.Path,
		CrunchJS.Components.Viewport
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


		var camEntity = this.createEntity();

		
			

		/*this.addComponent(ent2, new CrunchJS.Components.Body({
			width : 3,
			height : 3
		}));*/

		var tiles = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
		
		// var tiles = [
		// 	[0,0,0,0,0,0,0,0,0,0],
		// 	[0,1,1,1,1,1,1,1,1,0],
		// 	[0,1,1,1,1,0,0,0,1,0],
		// 	[0,1,1,1,0,0,1,0,1,0],
		// 	[0,1,1,0,0,1,1,0,1,0],
		// 	[0,1,1,0,1,1,1,1,1,0],
		// 	[0,1,1,0,1,1,1,0,1,0],
		// 	[0,1,1,0,1,0,0,0,1,0],
		// 	[0,1,1,1,1,1,1,1,1,0],
		// 	[0,0,0,0,0,0,0,0,0,0]
		// ];

		
		var xStart = -95,
			yStart = -50;

		this.addComponents(entity, 
			new CrunchJS.Components.Transform({
				layer : 0x00000001
			}),
			new CrunchJS.Components.OccupancyGrid({
				width : tiles[0].length,
				height : tiles.length,
				tileWidth : 10,
				tileHeight : 10
			})
		);

		this.addComponents(camEntity, 
			new CrunchJS.Components.Transform({
				layer : 0x00000001
			}),
			new CrunchJS.Components.Camera({
		      isActive: true,
		      screenSpace: {
		        ux: 0, uy: 0,
		        lx: 600, ly:600
		      },
		      lensSize: {
		        width: 100,
		        height: 56.25
		      },
		      constraints : {
		      	topLeft : {
		      		x : xStart-5,
		      		y : yStart-5
		      	},
		      	bottomRight : {
		      		x : xStart-5 + tiles[0].length*10,
		      		y : yStart-5 + tiles.length*10
		      	}
		      }
	    	})
		);

		goog.array.forEach(tiles, function(row, y) {
			goog.array.forEach(row, function(tile,x) {

				var id = this.createEntity();

				this.addComponents(id, 
					new CrunchJS.Components.Transform({
						x : xStart+x*10,
						y : yStart+y*10,
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
							x : xStart+x*10,
							y : yStart+y*10,
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
				x : xStart + 10,
				y : yStart + 10,
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

	
		var sys = new CrunchJS.Systems.RenderingSystem({
			entityId : 1
		});

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

		this.addEventListener('click', function() {	
			var viewport = self.getComponent(1, 'Viewport'),
        		transform = self.getComponent(2, 'Transform'),
        		camera = self.getComponent(2, 'Camera');

			var width = viewport.getWidth(),
				height = viewport.getHeight(),
				xOffset = (viewport.getMousePosition().x/width)*camera.lensSize.width,
				yOffset = (viewport.getMousePosition().y/height)*camera.lensSize.height,
				left = (transform.x-camera.lensSize.width/2),
				top = (transform.y-camera.lensSize.height/2);

			var end = {
				x : xOffset+left,
				y : yOffset+top
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

		this.addEventListener(CrunchJS.EngineCommands.Sync, function() {			
			self.fireEvent('Resize');	
		});
	}

};

CloseContact.Scenes.GameScene.prototype.process = function(frame) {
	goog.base(this, 'process', frame);

	if(!CrunchJS.world.isSim()){
		var viewport = this.getComponent(1, 'Viewport'),
	        transform = this.getComponent(2, 'Transform'),
	        camera = this.getComponent(2, 'Camera');

	    var pt = viewport.getMousePosition(),
	    	width = viewport.getWidth(),
	    	height = viewport.getHeight();

	    if(pt.x <= width*.05){
	    	// Move outside left contstraints 
	    	if(camera.constraints.topLeft.x > transform.x-1-camera.lensSize.width/2){
	    		transform.x = camera.constraints.topLeft.x + camera.lensSize.width/2;
	    	}
	    	else{
	      		transform.x = transform.x - 1;
	      	}
	    }
	    else if(pt.x >= width*.95){
	    	if(camera.constraints.bottomRight.x < transform.x+1+camera.lensSize.width/2){
	    		transform.x = camera.constraints.bottomRight.x - camera.lensSize.width/2;
	    	}
	    	else{
	      		transform.x = transform.x + 1;
	      	}
	    }

	    if(pt.y <= height*.05){
	    	if(camera.constraints.topLeft.y > transform.y-1-camera.lensSize.height/2){
	    		transform.y = camera.constraints.topLeft.y + camera.lensSize.height/2;
	    	}
	    	else{
	      		transform.y = transform.y - 1;
	      	}
	    }
	    else if(pt.y >= height*.95){
	    	if(camera.constraints.bottomRight.y < transform.y+1+camera.lensSize.height/2){
	    		transform.y = camera.constraints.bottomRight.y - camera.lensSize.height/2;
	    	}
	    	else{
	      		transform.y = transform.y + 1;
	      	}
	    }
	}
};

CloseContact.Scenes.GameScene.prototype.deactivate = function() {
	if(!CrunchJS.world.isSim())
		$("#game").html('');

	this._networkManager.deactivate();
};
