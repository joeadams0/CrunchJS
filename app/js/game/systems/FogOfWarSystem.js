/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.FogOfWarSystem');

goog.require('CrunchJS.System');
goog.require('CrunchJS.Components.RenderShape');
goog.require('goog.structs');
goog.require('goog.array');
goog.require('goog.structs.Set');
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
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'RenderImage', 'Map'));
	this.shownEntities = new goog.structs.Set();
};


CloseContact.Systems.FogOfWarSystem.prototype.process = function(frame) {
	var actors = this.getScene().getComponentsByType('Actor'),
		gameMaster = this.getScene().getComponent(1, 'GameMaster'),
		players = this.getScene().getComponentsByType('Player'),
		occGrid = this.getScene().getComponent(1, 'OccupancyGrid'),
		team,
		highlightedEnts;

	var fowComp = this.getScene().getComponent(1, "FoWComponent");

	highlightedEnts = fowComp.getHighlightedEntities();

	for(var i = 0; i<highlightedEnts.length; i++){
		var ent = highlightedEnts.pop();
		var renImg = this.getScene().getComponent(ent, 'RenderImage');

		if(renImg)
			renImg.setTint(0x585858);

	}

	var selfEntity;

	goog.structs.forEach(players, function(player) {
		if(player.getPId() == gameMaster.getPId()){
			selfEntity = player.entityId;
			team = this.getScene().getComponent(player.entityId, 'Actor').getTeam();
		}
	}, this);


	goog.structs.forEach(actors, function(actor) {
		if(actor.getTeam() == team){
			var visionRange = actor.getVisionRange()/10,
				trans = this.getScene().getComponent(actor.entityId, 'Transform'),
				startTile = occGrid.coordToTile(trans.getX(), trans.getY());
			
			var renImg;
			if((renImg = this.getRenderImage(startTile.x, startTile.y)) && trans){
				this.shownEntities.add(this.getScene().getEntityByName('tile-'+startTile.x+'-'+startTile.y));
				renImg.setTint(0xFFFFFF);
			}

			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,0, 1, 1, 0, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,1, 0, 0, 1, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,0, -1, 1, 0, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,-1, 0, 0, 1, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,0, -1, -1, 0, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,-1, 0, 0,-1, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,0, 1, -1, 0, occGrid);
			this.mapLight(1, startTile.x, startTile.y, 1, 0, visionRange,1, 0, 0, -1, occGrid);
			
		}

		else{
			var tower = this.getScene().getComponent(actor.entityId, "Tower");

			if(!tower){
				
				var selfActor = this.getScene().getComponent(selfEntity, 'Actor'),
					transform  = this.getScene().getComponent(selfEntity, 'Transform'),
					enemyTrans = this.getScene().getComponent(actor.entityId, 'Transform'),
					renderImg = this.getScene().getComponent(actor.entityId, 'RenderImage'),
					renderText = this.getScene().getComponent(actor.entityId, 'RenderText'),
					renderShape = this.getScene().getComponent(actor.entityId, 'RenderShape'),
					renderable;

				if(transform && selfActor){
					renderable =  transform.distance(enemyTrans) <= selfActor.getVisionRange();
				}
				else{
					renderable = false;
				}

				if(renderImg){
					renderImg.setRenderable(renderable);
				}
				if(renderText){
					renderText.setRenderable(renderable);
				}
				if(renderShape){
					renderShape.setRenderable(renderable);
				}
			}
		}
	}, this);
};

// Algorithm : http://playtechs.blogspot.com/2007/03/raytracing-on-grid.html
CloseContact.Systems.FogOfWarSystem.prototype.mapLight = function(row, startX, startY, start, end, radius, xx, xy, yx, yy, occGrid) {
	var newStart = 0,
		blocked = false;

	if(start < end)
		return;

	var fowComp = this.getScene().getComponent(1, "FoWComponent");

	var highlightedEnts = fowComp.getHighlightedEntities();

	for(var distance = row; distance<=radius && !blocked; distance++){
		var deltaY = -distance;

		for(var deltaX = -distance; deltaX <= 0; deltaX++){
			var currentX = startX + deltaX * xx + deltaY*xy,
				currentY = startY + deltaX * yx + deltaY*yy,
				leftSlope = (deltaX-.5)/(deltaY+.5),
				rightSlope = (deltaX+.5)/(deltaY-.5);

			if(!(currentX>=0 && currentY>=0 && currentX<occGrid.getWidth() && currentY<occGrid.getHeight()) || start < rightSlope){
				continue;
			}
			else if(end > leftSlope){
				break;
			}

			// For each tile that should be lighted 
			if(Math.sqrt(Math.pow(startX-currentX, 2) + Math.pow(startY-currentY, 2)) <= radius){

				var tile = occGrid.getTile(currentX, currentY);

				goog.structs.forEach(tile.entities, function(ent) {
					var renImg = this.getScene().getComponent(ent, 'RenderImage');

					if(renImg){
						renImg.setTint(0xFFFFFF);
						highlightedEnts.push(ent);
					}

				}, this);

				var renImg;
				if(renImg = this.getRenderImage(currentX, currentY)){
					highlightedEnts.push(this.getScene().getEntityByName('tile-'+currentX+'-'+currentY));
					renImg.setTint(0xFFFFFF);
				}
			}

			// The last one was blocked
			if(blocked){
				if(!this.canSeeThroughTile(currentX,currentY, occGrid)){
					newStart = rightSlope;
					continue;
				}
				else{
					blocked = false;
					start = newStart;
				}
			}
			else{
				if(!this.canSeeThroughTile(currentX,currentY, occGrid) && distance<radius){
					blocked = true;
					this.mapLight(distance+1, startX, startY, start, leftSlope, radius, xx, xy, yx, yy, occGrid);
					newStart = rightSlope;
				}
			}
		}
	}
};

CloseContact.Systems.FogOfWarSystem.prototype.canSeeThroughTile = function(x,y,occGrid) {
	var tile = occGrid.getTile(x,y),
		canSeeThrough = true;

	goog.structs.forEach(tile.entities, function(ent) {

		var occ = this.getScene().getComponent(ent, 'Occupancy');

		canSeeThrough = canSeeThrough && occ.getCanSeeThrough();

	}, this);

	return canSeeThrough;
};

CloseContact.Systems.FogOfWarSystem.prototype.getRenderImage = function(x, y) {
	return this.getScene().getComponent(this.getScene().getEntityByName('tile-'+x+'-'+y), 'RenderImage');
};

CloseContact.Systems.FogOfWarSystem.prototype.refreshData = function() {
	goog.base(this, 'refreshData');
	this.fowComp = this.getScene().getComponent(1, "FoWComponent");
};