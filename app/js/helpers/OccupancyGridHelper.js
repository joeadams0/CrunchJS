/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Helpers.OccupancyGridHelper');

goog.require('goog.array');
goog.require('goog.math.Rect');
goog.require('goog.math');
goog.require('goog.array');
goog.require('goog.structs.Set');

/**
 * A class to help perform logic on an Occupancy grid helper within a scene. Dont forget to set the scene.
 * @class 
 * @constructor
 */
CrunchJS.Helpers.OccupancyGridHelper = function() {
};

goog.addSingletonGetter(CrunchJS.Helpers.OccupancyGridHelper);

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

			map[x][y] = {
				
				occupancy : 0x00000000,

				entities : new goog.structs.Set()
			};
		}
	}

	return map;
};

/**
 * Checks if the tile(s) are occupied.
 * @param {CrunchJS.Components.OccupancyGrid} params.comp The tile map component
 * @param  {goog.math.Rect}  params.rect The Rectangle to check, or x index of the tile
 * @param {number=} params.x If no rect is specified, specify the x of the tile to check
 * @param  {number=}  params.y The y index of the tile
 * @param {number=} params.width The number of tiles to check in the x direction. Defaults to 1
 * @param {number=} params.height The number of tiles to check in the y direction. Defaults to 1
 * @param {number=} params.layer The layer to check for occupancy on. Defaults to 1
 * @return {Boolean}   True if you can walk over all of the tiles
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.isOccupied = function(params) {
	if(params.rect){
		return this.isOccupied({
			comp : params.comp,
			x : params.rect.left,
			y : params.rect.top,
			height : params.rect.height,
			width : params.rect.width,
			layer : params.layer
		});
	}
	else if(goog.isNumber(params.x)  && goog.isNumber(params.y)){
		var width = params.width ? params.width : 1,
			height = params.height ? params.height : 1,
			layer = params.layer ? params.layer : 1;

		// Check all tiles in the rectangle, and see if they have something
		for(var x = params.x; x <= params.x+width-1; x++){
			for(var y = params.y; y <= params.y+height-1; y++){
				// If they share any bits, then we know it is occupied				
				if((this.getTile(params.comp, x, y).occupancy & layer) != 0)
					return true;
			}
		}

		return false;
	}
};

/**
 * Gets the tile for a component
 * @param  {CrunchJS.Components.OccupancyGrid} comp The component to opperate on
 * @param  {Number} x    The x index
 * @param  {Number} y    The y index
 * @return {Object}      The data at the tile
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getTile = function(comp,x,y) {
	if(this.isInBounds(comp, x, y))
		return comp.map[x][y];
};

/**
 * Sets the all of the tiles the entity is over to be occupied by the id of the entity
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} comp The entity id
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.addEntity = function(comp, id) {
	var rect = this.getRect(id),
		transform = this.getScene().getComponent(id, 'Transform');

	if(rect){

		// Get the tile rect
		rect = this.getTileRange(comp, rect);
		for(var i = rect.top; i <= rect.top+rect.height-1; i++){
			for(var j = rect.left; j <= rect.left+rect.width-1 ; j++){
				this.setTile(comp, j, i, id, transform.layer);
			}
		}
		comp.entityToTilesMap.set(id, rect);
	}
};

/**
 * Sets the tile to be occuped by the id
 * @param {CrunchJS.Components.OccupancyGrid} comp The Occupancy Grid
 * @param {number} x    The tile x
 * @param {number} y    The tile y
 * @param {number} id The entity Id
 * @param {number} layer The layer to set
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setTile = function(comp, x, y, id, layer) {
	var tile = this.getTile(comp, x, y);
	tile.entities.add(id);
	tile.occupancy = tile.occupancy | layer;

};

/**
 * Removes the entity from all tiles on the grid
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} id The id of the component
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.removeEntity = function(comp, id) {
	if(comp.entityToTilesMap.containsKey(id)){

		var rect = comp.entityToTilesMap.get(id);
		for(var i = rect.top; i <= rect.top+rect.height-1; i++){
			for(var j = rect.left; j <= rect.left+rect.width-1 ; j++){
				this.getTile(comp, j, i).entities.remove(id);
				this.refreshTile(comp, j, i);
			}
		}

		comp.entityToTilesMap.remove(id);
	
	}

};

/**
 * Updates an entity's position
 * @param  {CrunchJS.Components.OccupancyGrid} comp The component to modify
 * @param  {number} id   The entity id
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.updateEntity = function(comp, id) {
	this.removeEntity(comp, id);
	this.addEntity(comp,id);
};

/**
 * Refreshes the occupancy flags for the tile
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} id The id of the occupier
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.refreshTile = function(comp, x, y) {
	var tile = this.getTile(comp, x, y),
		occupancy = 0;

	goog.structs.forEach(tile.entities, function(entityId) {
		occupancy = occupancy | this.getScene().getComponent(entityId, 'Transform').layer;
	});

	tile.occupancy = occupancy;
};

/**
 * Gets the bounding rect of the entity for occupancy purposes
 * @param  {number} id The entity id
 * @return {goog.math.Rect}    The rect of the entity
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getRect = function(id) {
	var	size, rect,
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

	if(size)
		rect = new goog.math.Rect(transform.x - size.width/2, transform.y - size.height/2, size.width, size.height);

	return rect;
};

/**
 * Gets the neighboring tiles for a tile, or a rectangle of tiles. For this function, you can either specify an x and y, or a Rect, or an entity Id to find the neighbors of.
 * @param  {CrunchJS.Components.OccupancyGrid} params.comp The occupancy grid to get the neighbors from
 * @param {number=} params.x The x coordinate of the tile
 * @param {number=} params.y The y coordinate of the tile
 * @param {goog.math.Rect=} params.rect The rect to find the neighbors around.
 * @param {number=} params.id The id of the entity to find the tiles around
 * @param {boolead} params.diag If true, will get diagonal neighbors
 * @return {goog.structs.Set}        The set of neighbors
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getNeighbors = function(params) {
	if(goog.isNumber(params.id)){
		
		var rect;

		if(params.comp.entityToTilesMap.containsKey(params.id)){
			rect = params.comp.entityToTilesMap.get(params.id);
		}
		else{
			rect = this.getRect(params.id);
		}

		return this.getNeighbors({
			comp : params.comp,
			rect : rect,
			diag : params.diag
		});
	}
	else if (goog.isDefAndNotNull(params.rect)){
		var neighborTiles = new goog.structs.Set(),
			entityTiles = new goog.structs.Set();

		for(var x = rect.left; x<rect.left+rect.width; x++){
			for(var y = rect.top; y<rect.top+rect.height; y++){

				neighborTiles.addAll(this.getNeighbors({
					comp : params.comp,
					x : x,
					y : y,
					diag : params.diag
				}));

				// Use these to remove the entity tiles from the neighbor tiles set later
				entityTiles.add({
					x:x,
					y:y
				});
			}
		}

		var arr = goog.structs.filter(neighborTiles, function(nTile) {
			var success = goog.structs.some(entityTiles, function(eTile) {
				return nTile.x == eTile.x && nTile.y == eTile.y;
			});
			return !success;
		});

		return new goog.structs.Set(arr);
	}
	else if(goog.isDefAndNotNull(params.x) && goog.isDefAndNotNull(params.y)){
		var neighbors = new goog.structs.Set();

		for(var x = params.x-1; x<=params.x+1; x++){
			for(var y = params.y-1; y<=params.y+1; y++){

				// Not the center tile, and is in bounds
				if(x != params.x || y != params.y && this.isInBounds(params.comp, x, y)){

					if(params.diag){

						neighbors.add({
							x : x,
							y : y
						});

					}
					else if((x-params.x)%2 == 0 || (y-params.y)%2 == 0){

						neighbors.add({
							x : x,
							y : y
						});

					}
				}
				
			}
		}
		return neighbors;
	}
};

/**
 * Checks if the tile is in bounds
 * @param  {CrunchJS.Components.OccupancyGrid}  comp The occupancy grid to opperate on
 * @param  {numebr}  x    The x coord of the tile
 * @param  {number}  y    The y coord of the tile
 * @return {Boolean}      True if it is in bounds
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.isInBounds = function(comp, x, y) {
	return comp.map.length>x && comp.map[x].length > y;
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
			y : transform.y - comp.height/2 * comp.tileHeight
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