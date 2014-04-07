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
goog.require('CloseContact.Systems.TowerSystem');
goog.require('CloseContact.Systems.AttackSystem');
goog.require('CloseContact.Systems.ActorSystem');

// Comps
goog.require('CrunchJS.Components.Transform');
goog.require('CrunchJS.Components.RenderImage');
goog.require('CrunchJS.Components.RenderShape');
goog.require('CrunchJS.Components.RenderText');
goog.require('CrunchJS.Components.Camera');
goog.require('CrunchJS.Components.OccupancyGrid');
goog.require('CrunchJS.Components.Body');
goog.require('CrunchJS.Components.Occupancy');
goog.require('CrunchJS.Components.PathQuery');
goog.require('CrunchJS.Components.Path');
goog.require('CrunchJS.Components.Viewport');
goog.require('CloseContact.Components.Actor');
goog.require('CloseContact.Components.Tower');
goog.require('CloseContact.Components.Attack');

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
		CrunchJS.Components.RenderShape,
		CrunchJS.Components.RenderText,
		CrunchJS.Components.Camera,
		CrunchJS.Components.PathQuery,
		CrunchJS.Components.Path,
		CrunchJS.Components.Viewport,
		CloseContact.Components.Actor,
		CloseContact.Components.Tower,
		CloseContact.Components.Attack
	];

	goog.array.forEach(comps, function(comp) {
		this.registerComponent(comp)
	}, this);


	// If it is the sim
	if(CrunchJS.world.isSim()){
		
		var occSys = new CrunchJS.Systems.OccupancyGridSystem(),
			pathSys = new CrunchJS.Systems.PathfindingSystem(),
			pathMoveSys = new CrunchJS.Systems.PathMovementSystem(),
			towerSystem = new CloseContact.Systems.TowerSystem(),
			attackSystem = new CloseContact.Systems.AttackSystem(),
			actorSystem = new CloseContact.Systems.ActorSystem();

		this.addSystem(occSys);
		this.addSystem(pathSys);
		this.addSystem(pathMoveSys);
		this.addSystem(towerSystem);
		this.addSystem(attackSystem);
		this.addSystem(actorSystem);

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

		var tiles = [
			[11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,1,1,1,15],
			[14,1,1,1,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,1,1,1,15],
			[14,1,1,1,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,10,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[14,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15],
			[16,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,18]
		];

		var tileSet = [
			'assets/tree.png', // 0
			'assets/grass.png', // 1
			'assets/path-top-left.png', // 2
			'assets/path-top-middle.png', // 3
			'assets/path-top-right.png', // 4
			'assets/path-middle-left.png', // 5
			'assets/path-middle-middle.png', // 6
			'assets/path-middle-right.png', // 7
			'assets/path-bottom-left.png', // 8
			'assets/path-bottom-middle.png', // 9
			'assets/path-bottom-right.png', // 10
			'assets/wall-top-left.png', // 11
			'assets/wall-top-middle.png', // 12
			'assets/wall-top-right.png', // 13
			'assets/wall-middle-left.png', // 14
			'assets/wall-middle-right.png', // 15
			'assets/wall-bottom-left.png', // 16
			'assets/wall-bottom-middle.png', // 17
			'assets/wall-bottom-right.png', // 18
			'assets/tower.png' // 19

		];
		
		var xStart = -170,
			yStart = -70;

		var width = tiles[0].length,
			height = tiles.length;
		console.log(width);
		console.log(height);

    // add components to the occupancyGrid entity
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

    // add components to the camEntity
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
		        width: 200,
		        height: 112.5
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

    // handle instantiating all the tiles
		goog.array.forEach(tiles, function(row, y) {
			goog.array.forEach(row, function(tile,x) {

				var id = this.createEntity(),
					trans = {
						x : xStart+x*10,
						y : yStart+y*10,
						layer : 0x00000001
					},
					body = {
						width : 10,
						height : 10
					};

				if(tile){

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
							image : 'assets/grass.png'
						})
					);					
					if(tile>1){
						id = this.createEntity();

						this.addComponents(id, 
							new CrunchJS.Components.Transform(trans),
							new CrunchJS.Components.Body(body),

							new CrunchJS.Components.RenderImage({
								image : tileSet[tile]
							})
						);
					}
				}

				if(tile>=11){
					this.addComponent(id, new CrunchJS.Components.Occupancy());
				}

			}, this);
		},this);


    // handle the warrior
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
		    }),

		    new CloseContact.Components.Actor({
		    	team : 0,
		    	health : 100
		    }),

			new CrunchJS.Components.RenderText({
		        text: "User1",
		        style: {
		          font: "5px",
		          fill: "white"
		        },
		        offset: {
		          x: 0,
		          y: -10
		        }
			})
		);

		var tower1 = this.createEntity(),
			tower2 = this.createEntity();

		this.addComponents(tower1,
			new CrunchJS.Components.Transform({
				x : xStart+25,
				y : yStart+height/2*10-17,
				layer : 0x00000001
			}),
			new CrunchJS.Components.RenderImage({
		      image: 'assets/tower.png',
		      size : {
		      	x : 17,
		      	y : 34
		      }
		    }),
		    new CrunchJS.Components.Body({
		    	width : 15,
		    	height : 15
		    }),
		    new CrunchJS.Components.Occupancy(),

		    new CloseContact.Components.Actor({
		    	attackDmg : 20,
		    	team : 0
		    }),
		    new CloseContact.Components.Tower()
		);

		this.addComponents(tower2,
			new CrunchJS.Components.Transform({
				x : xStart+width*10-35,
				y : yStart+height/2*10-17,
				layer : 0x00000001
			}),
			new CrunchJS.Components.RenderImage({
		      image: 'assets/tower.png',
		      size : {
		      	x : 17,
		      	y : 34
		      }
		    }),
		    new CrunchJS.Components.Body({
		    	width : 15,
		    	height : 15
		    }),
		    new CrunchJS.Components.Occupancy(),

		    new CloseContact.Components.Actor({
		    	attackDmg : 20,
		    	team : 1
		    }),

		    new CloseContact.Components.Tower()
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
