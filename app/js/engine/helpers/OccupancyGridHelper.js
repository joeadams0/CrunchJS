/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Helpers.OccupancyGridHelper');

goog.require('goog.array');
goog.require('goog.math.Rect');
goog.require('goog.math');

/**
 * A class to help perform logic on an Occupancy grid helper within a scene
 * @class 
 * @constructor
 * @param {CrunchJS.Scene} scene The scene to operate in
 */
CrunchJS.Helpers.OccupancyGridHelper = function(scene) {
	this.scene = scene;
};

CrunchJS.Helpers.OccupancyGridHelper.prototype.getScene = function() {
	return this.scene;
};

CrunchJS.Helpers.OccupancyGridHelper.prototype.setScene = function(scene) {
	this.scene = scene;
};

/**
 * Creates a map data representation
 * @param  {number} mapWidth  The number of tiles wide the map is
 * @param  {number} mapHeight The number of tiles high the map is
 * @return {Object}           The map
 */
CrunchJS.Helpers.OccupancyGridHelper.createMap = function(mapWidth,mapHeight) {
	var map = [];

	for(var x = 0; x < mapWidth; x++){
		map[x] = [];
		
		for(var y = 0; y < mapHeight; y++){
			map[x][y] = -1;
		}
	}

	return map;
};

/**
 * Checks if the tile(s) are walkable.
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param  {(goog.math.Rect|number)}  rect The Rectangle to check, or x index of the tile
 * @param  {number=}  y The y index of the tile
 * @param {number=} width The number of tiles to check in the x direction. Defaults to 1
 * @param {number=} height The number of tiles to check in the y direction. Defaults to 1
 * @return {Boolean}   True if you can walk over all of the tiles
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.isWalkable = function(comp,rect,y,width,height) {
	if(!width && typeof rect == 'number'){
		var ocComp = this.getOccupComp(comp, rect, y); 
		return ocComp && ocComp.walkable;
	}
	if(typeof rect == 'number'){
		var newRect = new goog.math.Rect(rect,y,width,height);
		return this.isWalkable(comp, newRect);
	}
	else{
		var isWalkable = true;
		for(var i = rect.top; i <= rect.top+rect.height && isWalkable; i++){
			for(var j = rect.left; j <= rect.left+rect.width && isWalkable; j++){
				isWalkable = this.isWalkable(comp, j, i);
			}
		}
		return isWalkable;
	}
};

/**
 * Checks if a unit can fly over the tiles
 * @param  {CrunchJS.Components.OccupancyGrid}  comp   The tile map component
 * @param  {(goog.math.Rect|number)}  rect   The rectangle to check, of the x index of the tile.
 * @param  {number=}  y      The y index of the tile
 * @param  {number=}  width  The number of tiles to check in the x direction. Defaults to 1.
 * @param  {number=}  height The number of tiles to check in the y direction. Defalts to 1.
 * @return {Boolean}        True if you can fly over all of the tiles
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.isFlyable = function(comp, rect, y, width, height) {
	if(!width && typeof rect == 'number'){
		var ocComp = this.getOccupComp(comp, rect, y); 
		return ocComp && ocComp.flylable;
	}
	if(typeof rect == 'number'){
		var newRect = new goog.math.Rect(rect,y,width,height);
		return this.isFlyable(comp, newRect);
	}
	else{
		var isFlyable = true;
		for(var i = rect.top; i <= rect.top+rect.height && isFlyable; i++){
			for(var j = rect.left; j <= rect.left+rect.width && isFlyable; j++){
				isFlyable = this.isFlyable(comp, j, i);
			}
		}
		return isFlyable;
	}
};

/**
 * Gets the Occupancy component from the entity that occupies that tile
 * @param  {CrunchJS.Components.OccupancyGrid} comp The occupancy grid
 * @param  {number} x    The x loc of the tile
 * @param  {number} y    The y loc of the tile
 * @return {CrunchJS.Components.Occupancy}      The Occupancy Component
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getOccupComp = function(comp, x, y) {
	return this.getScene().getComponent(this.getOccupier(comp,x,y), 'Occupancy');
};
/**
 * Gets the id that occupies the tile
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param  {number} x The x index of the tile
 * @param  {number} y The y index of the tile
 * @return {number}   The entity id
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getOccupier = function(comp,x,y) {
	return comp.map[x][y];
};

/**
 * Sets the all of the tiles the entity is over to be occupied by the id of the entity
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} comp The entity id
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setOccupied = function(comp, id) {
	var size,
		occ = this.getScene().getComponent(id, 'Occupancy'),
		transform = this.getScene().getComponent(id, 'Transform');
	// Try to use the occupancy size if there is one
	if(occ.size){
		size = occ.size;
	}
	// Otherwise use body
	else{
		var body = this.getScene().getComponent(id, 'Body');
		if(!body)
			throw "This entity has no size, so it cannot be put on the occupancy grid";
		else
			size = body.size;
	}


	if(size){
		var rect = new goog.math.Rect(transform.x-size.width/2, transform.y-size.height/2, size.width, size.height);

		// Get the tile rect
		rect = this.getTileRange(comp, rect);
		for(var i = rect.top; i <= rect.top+rect.height-1; i++){
			for(var j = rect.left; j <= rect.left+rect.width-1 ; j++){
				this.setTile(comp, id, j, i);
			}
		}
	}
};

/**
 * Sets the tile to be occuped by the id
 * @param {CrunchJS.Components.OccupancyGrid} comp The Occupancy Grid
 * @param {number} id   The id to set the tile to
 * @param {number} x    The tile x
 * @param {number} y    The tile y
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setTile = function(comp, id, x, y) {
	if(comp.map.length > x && comp.map[x].length > y)
		comp.map[x][y] = id;
};

/**
 * Sets the tile to be unoccupied
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} x The x index of the tile
 * @param {number} y The y index of the tile
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setUnoccupied = function(comp, x,y) {

};

/**
 * Sets all tiles occupied by the given id to be unoccupied
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} id The id of the occupier
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setAllUnoccupied = function(comp, id) {
	
};

/**
 * Gets a rectangle of tiles covered by the input rectangle
 * @param  {CrunchJS.Components.OccupancyGrid} comp The tile map to operate on
 * @param  {goog.math.Rect} rect    The rectangle in real world coords
 * @return {goog.math.Rect}         The rectangle of tiles
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getTileRange = function(comp,rect) {
	var transform = this.getScene().getComponent(comp.entityId, "Transform");

	if(!transform)
		throw "No transform on OccupancyGrid entity. Cannot calculate tile range";
	else{
		var topLeft = {
			x : transform.x - comp.width/2 * comp.tileWidth,
			y : transform.y - comp.height/2 * comp.tileHeight,
		};

		// Make rect is on grid
		rect.top = goog.math.clamp(rect.top, topLeft.y, topLeft.y + comp.height*comp.tileHeight);
		rect.left = goog.math.clamp(rect.left, topLeft.x, topLeft.x + comp.width*comp.tileWidth);
		rect.height = goog.math.clamp(rect.height, topLeft.y, topLeft.y + comp.height*comp.tileHeight);
		rect.width = goog.math.clamp(rect.width, topLeft.x, topLeft.x + comp.width*comp.tileWidth);

		var originOffset = {
			x : rect.left - topLeft.x,
			y : rect.top - topLeft.y
		};

		var tileOrigin = {
			x : goog.math.safeFloor(originOffset.x/comp.tileWidth),
			y : goog.math.safeFloor(originOffset.y/comp.tileHeight)
		};

		var numTilesWide = goog.math.safeCeil(rect.width/comp.tileWidth + originOffset.x/comp.tileWidth - tileOrigin.x);
		var numTilesHigh = goog.math.safeCeil(rect.height/comp.tileHeight + originOffset.y/comp.tileHeight - tileOrigin.y);

		return new goog.math.Rect(tileOrigin.x, tileOrigin.y, numTilesWide, numTilesHigh);
	}

};