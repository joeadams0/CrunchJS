/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.FogOfWarSystem');

goog.require('CrunchJS.System');
goog.require('CrunchJS.Components.RenderShape');
goog.require('goog.structs');
goog.require('goog.array');

/**
 * @constructor
 * @class
 */
CloseContact.Systems.FogOfWarSystem = function() {
	goog.base(this);
};

goog.inherits(CloseContact.Systems.FogOfWarSystem, CrunchJS.System);

CloseContact.Systems.FogOfWarSystem.prototype.name = 'FogOfWarSystem';

CloseContact.Systems.FogOfWarSystem.prototype.activate = function() {
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'RenderImage'));
};


CloseContact.Systems.FogOfWarSystem.prototype.process = function(frame) {
	var actors = this.getScene().getComponentsByType('Actor'),
		gameMaster = this.getScene().getComponent(1, 'GameMaster'),
		players = this.getScene().getComponentsByType('Player'),
		occGrid = this.getScene().getComponent(1, 'OccupancyGrid'),
		team;

	// goog.structs.forEach(this.getActiveEntities, function(ent) {
	// 	var renImg = this.getScene().getComponent(ent, 'RenderImage');

	// 	if(renImg)
	// 		renImg.tint = 0x585858;

	// }, this);


	goog.structs.forEach(players, function(player) {
		if(player.getPId() == gameMaster.getPId()){
			team = this.getScene().getComponent(player.entityId, 'Actor').getTeam();
		}
	}, this);

	goog.structs.forEach(actors, function(actor) {
		if(actor.getTeam() == team){
			var visionRange = actor.getVisionRange(),
				trans = this.getScene().getComponent(actor.entityId, 'Transform'),
				startTile = occGrid.coordToTile(trans.getX(), trans.getY()),
				openList = [],
				closedList = [];

			openList.push(startTile);

			while(openList.length > 0){
				var tile = openList.pop(),
					tileId = this.getScene().getEntityByName('tile-'+tile.x+'-'+tile.y),
					renImg = this.getScene().getComponent(tileId, 'RenderImage');

				renImg.tint = 0xFFFFFF;

				closedList.push(tile);

				var neighbors = occGrid.getNeighbors({
					x : tile.x,
					y : tile.y,
					diag : true
				});

				goog.structs.forEach(neighbors, function(neighbor) {

					var dist = Math.sqrt(Math.pow(neighbor.x-startTile.x, 2) + Math.pow(neighbor.y-startTile.y, 2));

					if(dist <= visionRange/10){

						var isClosed = goog.array.find(closedList, function(tile) {
							return tile.x == neighbor.x && tile.y == neighbor.y;
						}, this);


						if(!isClosed){
							openList.push(neighbor);
						}
					}

				}, this);
			}
		}
	}, this);
};

// Algorithm : http://playtechs.blogspot.com/2007/03/raytracing-on-grid.html
CloseContact.Systems.FogOfWarSystem.prototype.canSee = function(x0, y0, x1, y1, occGrid) {
	var dx = Math.abs(x1-x0),
		dy = Math.abs(y1-y0),
		x = x0,
		y = y0,
		n = 1 + dx + dy,
		x_inc = (x1>x0) ? 1 : -1,
		y_inc = (y1>y0) ? 1 : -1,
		error = dx-dy;

	dx *= 2;
	dy *= 2;

	for(; n>0; n--){

		if(occGrid.isOccupied({
			x : x,
			y : y
		})){
			return false;
		}
		if(error>0){
			x += x_inc;
			error -= dy;
		}
		else{
			y += y_inc;
			error += dx;
		}

	}

	return true;
};