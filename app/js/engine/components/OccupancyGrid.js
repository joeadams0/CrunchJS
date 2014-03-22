/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.OccupancyGrid');

goog.require('CrunchJS.Component');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');
goog.require('goog.structs');
goog.require('goog.math');
goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.math.Rect');

/**
 * Creates an Occupancy Grid Component. Occupancy Grids are used to be able to tell what space is occupied by which entities.
 * @param {Number} width      How many tiles wide the grid should be
 * @param {Number} height     How many tiles high the grid should be
 * @param {Number} tileWidth  The width of each tile
 * @param {Number} tileHeight The height of each tile
 * @constructor
 * @class 
 */
CrunchJS.Components.OccupancyGrid = function(params) {
	goog.base(this, params);

	/**
	 * The width of the grid in number of tiles
	 * @type {Number}
	 */
	this.width = params.width;

	/**
	 * The height of the grid in number of tiles
	 * @type {Number}
	 */
	this.height = params.height;

	/**
	 * The width of each tile
	 * @type {Number}
	 */
	this.tileWidth = params.tileWidth;

	/**
	 * The height of each tile
	 * @type {Number}
	 */
	this.tileHeight = params.tileHeight;

	/**
	 * The map of locations to occupancy tiles
	 * @type {Array}
	 */
	this.map;
	if(params.map){
		this.map = goog.array.map(params.map, function(col) {
			return goog.array.map(col, function(tile) {

				return {
					occupancy : tile.occupancy,
					entities : new goog.structs.Set(tile.entities)
				}

			}, this);
		}, this);
	}
	else {
		this.map = []
		for(var x = 0; x < this.width; x++){
			this.map[x] = [];
			
			for(var y = 0; y < this.height; y++){

				this.map[x][y] = {
					
					occupancy : 0x00000000,

					entities : new goog.structs.Set()
				};
			}
		}
	}

	/**
	 * Maps the entities to the rectangle of tiles they occupy in the map 
	 * @type {goog.structs.Map}
	 */
	this.entityToTilesMap = new goog.structs.Map();
	if(params.entityToTilesMap){
		goog.object.forEach(params.entityToTilesMap, function(rect) {
			return new goog.math.Rect(rect);
		});
	}

	this.updates = {
		// A set of tile locations that have changed
		map : new goog.structs.Set(),

		// A set of entities that have changed location
		entityToTilesMap : new goog.structs.Set()
	}

};

goog.inherits(CrunchJS.Components.OccupancyGrid, CrunchJS.Component);

CrunchJS.Components.OccupancyGrid.prototype.name = 'OccupancyGrid';

/**
 * Gets the width
 * @return {Number} The width
 */
CrunchJS.Components.OccupancyGrid.prototype.getWidth = function() {
	return this.width;
};

/**
 * Gets the height
 * @return {Number} Height
 */
CrunchJS.Components.OccupancyGrid.prototype.getHeight = function() {
	return this.height;
};

/**
 * Sets the width. This is very expensive
 * @param {Number} width The width
 */
CrunchJS.Components.OccupancyGrid.prototype.setWidth = function(width) {
	if(width != this.width){
		this.width = width;
		this.updates.width = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the height. This is very expensive
 * @param {Number} height The height
 */
CrunchJS.Components.OccupancyGrid.prototype.setHeight = function(height) {
	if(height != this.height){
		this.height = height;
		this.updates.height = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the tile width
 * @return {Number} The width of a single tile
 */
CrunchJS.Components.OccupancyGrid.prototype.getTileWidth = function() {
	return this.tileWidth;
};

/**
 * Get tile height
 * @return {Number} The height of a single tile
 */
CrunchJS.Components.OccupancyGrid.prototype.getTileHeight = function() {
	return this.tileHeight;
};

/**
 * Sets the tile width. This is very expesive
 * @param {Number} tileWidth The width of each tile
 */
CrunchJS.Components.OccupancyGrid.prototype.setTileWidth = function(tileWidth) {
	if(tileWidth != this.tileWidth){
		this.tileWidth = tileWidth;
		this.updates.tileWidth = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the tile height. This is very expensive
 * @param {Number} tileHeight The tile height
 */
CrunchJS.Components.OccupancyGrid.prototype.setTileHeight = function(tileHeight) {
	if(tileHeight != this.tileHeight){
		this.tileHeight = tileHeight;
		this.updates.tileHeight = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the tile
 * @param  {Number} x    The x index
 * @param  {Number} y    The y index
 * @return {Object}      The data at the tile
 */
CrunchJS.Components.OccupancyGrid.prototype.getTile = function(x,y) {
	if(this.isInBounds(x, y))
		return this.map[x][y];
};

/**
 * Sets the tile to be occuped by the id
 * @param {number} x    The tile x
 * @param {number} y    The tile y
 * @param {number} id The entity Id
 * @param {number} layer The layer to set
 */
CrunchJS.Components.OccupancyGrid.prototype.setTile = function(x, y, id, layer) {
	if(this.isInBounds(x, y)){
		var tile = this.getTile(x, y);
		tile.entities.add(id);
		tile.occupancy = tile.occupancy | layer;

		this.updates.map.add(y*this.width + x);

		this.hasBeenUpdated();
	}
};

CrunchJS.Components.OccupancyGrid.prototype.unsetTile = function(x, y, id) {
	this.getTile(x, y).entities.remove(id);
	this.refreshTile(x, y);

	this.updates.map.add(y*this.width + x);

	this.hasBeenUpdated();
};

/**
 * Sets the all of the tiles the entity is over to be occupied by the id of the entity
 * @param {number} id The entity id
 */
CrunchJS.Components.OccupancyGrid.prototype.addEntity = function(id) {
	// Already been added
	if(this.entityToTilesMap.containsKey(id))
		return;

	var rect = this.getRect(id),
		transform = this.getScene().getComponent(id, 'Transform');

	if(rect){

		// Get the tile rect
		rect = this.getTileRange(rect);
		for(var i = rect.top; i <= rect.top+rect.height-1; i++){
			for(var j = rect.left; j <= rect.left+rect.width-1 ; j++){
				this.setTile(j, i, id, transform.layer);
			}
		}

		this.entityToTilesMap.set(id, rect);

		this.updates.entityToTilesMap.add(id);
	}
};

/**
 * Removes the entity from all tiles on the grid
 * @param {number} id The id of the component
 */
CrunchJS.Components.OccupancyGrid.prototype.removeEntity = function(id) {
	if(this.entityToTilesMap.containsKey(id)){

		var rect = this.entityToTilesMap.get(id);
		for(var i = rect.top; i <= rect.top+rect.height-1; i++){
			for(var j = rect.left; j <= rect.left+rect.width-1 ; j++){
				this.unsetTile(j,i,id);
			}
		}

		this.entityToTilesMap.remove(id);

		this.updates.entityToTilesMap.add(id);
	
	}

};

/**
 * Translates world coordinates to tile coordinates
 * @param  {Number} x The x world coordinate
 * @param  {Number} y They y world coord
 * @return {Object}   The tile coords
 */
CrunchJS.Components.OccupancyGrid.prototype.coordToTile = function(x, y) {
	var transform = this.getScene().getComponent(this.entityId, 'Transform'),
		offset = {},
		tile = {};

	// Offset the coords by the transform of the occupancy grid
	offset.x = x - (transform.getX() - this.width/2*this.tileWidth);
	offset.y = y - (transform.getY() - this.height/2*this.tileHeight);

	tile.x = goog.math.safeFloor(offset.x/this.tileWidth);
	tile.y = goog.math.safeFloor(offset.y/this.tileHeight);

	return tile;
};

/**
 * Takes tile coords and returns the world coords for the center of the tile
 * @param  {Number} x The x tile coord
 * @param  {Number} y The y tile coord
 * @return {Object}   The world coords
 */
CrunchJS.Components.OccupancyGrid.prototype.tileToCoord = function(x,y) {
	var coords = {},
		transform = this.getScene().getComponent(this.entityId, 'Transform');

	coords.x = this.tileWidth*x+this.tileWidth/2;
	coords.y = this.tileHeight*y+this.tileHeight/2;

	coords.x += transform.x - this.width/2*this.tileWidth;
	coords.y += transform.y - this.height/2*this.tileHeight;

	return coords;
};


/**
 * Finds the nearest unoccupied tile to the specified location
 * @param  {Number} params.x The X coord
 * @param {Number} params.y The Y coord 
 * @return {Object}        The tile
 */
CrunchJS.Components.OccupancyGrid.prototype.findNearestUnoccupiedTile = function(params) {
	var tile = this.coordToTile(params.x, params.y),
		openList = [],
		closedList = [],
		currentTile;

	if(!this.isOccupied({
		x : tile.x,
		y : tile.y
	})){
		return tile;
	}

	openList.push(tile);

	while(openList.length != 0){
		currentTile = openList.pop();


		if(!this.isOccupied({
			x : currentTile.x,
			y : currentTile.y
		}))
			return currentTile;

		closedList.push(currentTile);

		var neighbors = this.getNeighbors({
			x : currentTile.x,
			y : currentTile.y,
			diag : true
		});

		goog.structs.forEach(neighbors, function(tile) {
			var t = goog.array.find(closedList, function(alreadySearchedTile) {
				return alreadySearchedTile.x == tile.x && alreadySearchedTile.y == tile.y;
			});
			if(!t){
				openList.push(tile);
			}

		}, this);

	}

};

/**
 * Updates an entity's position
 * @param  {number} id   The entity id
 */
CrunchJS.Components.OccupancyGrid.prototype.updateEntity = function(id) {
	this.removeEntity(id);
	this.addEntity(id);
};

/**
 * Checks if the tile is in bounds
 * @param  {numebr}  x    The x coord of the tile
 * @param  {number}  y    The y coord of the tile
 * @return {Boolean}      True if it is in bounds
 */
CrunchJS.Components.OccupancyGrid.prototype.isInBounds = function(x, y) {
	return x >= 0 && y >= 0 && this.map.length>x && this.map[x].length > y ;
};

/**
 * Checks if the tile(s) are occupied.
 * @param  {goog.math.Rect}  params.rect The Rectangle to check, or x index of the tile
 * @param {number=} params.x If no rect is specified, specify the x of the tile to check
 * @param  {number=}  params.y The y index of the tile
 * @param {number=} params.width The number of tiles to check in the x direction. Defaults to 1
 * @param {number=} params.height The number of tiles to check in the y direction. Defaults to 1
 * @param {number=} params.layer The layer to check for occupancy on. Defaults to 1
 * @return {Boolean}   True if you can walk over all of the tiles
 */
CrunchJS.Components.OccupancyGrid.prototype.isOccupied = function(params) {
	if(params.rect){
		return this.isOccupied({
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
				if((this.getTile(x, y).occupancy & layer) != 0)
					return true;
			}
		}

		return false;
	}
};

/**
 * Refreshes the occupancy flags for the tile
 * @param {number} id The id of the occupier
 */
CrunchJS.Components.OccupancyGrid.prototype.refreshTile = function(x, y) {
	var tile = this.getTile(x, y),
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
CrunchJS.Components.OccupancyGrid.prototype.getRect = function(id) {
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
 * @param {number=} params.x The x coordinate of the tile
 * @param {number=} params.y The y coordinate of the tile
 * @param {goog.math.Rect=} params.rect The rect to find the neighbors around.
 * @param {number=} params.id The id of the entity to find the tiles around
 * @param {boolead} params.diag If true, will get diagonal neighbors
 * @return {goog.structs.Set}        The set of neighbors
 */
CrunchJS.Components.OccupancyGrid.prototype.getNeighbors = function(params) {
	if(goog.isNumber(params.id)){
		
		var rect;

		if(this.entityToTilesMap.containsKey(params.id)){
			rect = this.entityToTilesMap.get(params.id);
		}
		else{
			rect = this.getRect(params.id);
		}

		return this.getNeighbors({
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
				if(!(x == params.x && y == params.y) && this.isInBounds(x, y)){

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
 * Gets a rectangle of tiles covered by the input rectangle
 * @param  {goog.math.Rect} rect    The rectangle in real world coords
 * @return {goog.math.Rect}         The rectangle of tiles
 */
CrunchJS.Components.OccupancyGrid.prototype.getTileRange = function(rect) {
	var transform = this.getScene().getComponent(this.entityId, "Transform");

	if(!transform)
		throw "No transform on OccupancyGrid entity. Cannot calculate tile range";
	else{
		var topLeft = {
			x : transform.x - this.width/2 * this.tileWidth,
			y : transform.y - this.height/2 * this.tileHeight
		};

		// Make rect is on grid
		rect.top = goog.math.clamp(rect.top, topLeft.y, topLeft.y + this.height*this.tileHeight);
		rect.left = goog.math.clamp(rect.left, topLeft.x, topLeft.x + this.width*this.tileWidth);
		rect.height = goog.math.clamp(rect.height, topLeft.y, topLeft.y + this.height*this.tileHeight);
		rect.width = goog.math.clamp(rect.width, topLeft.x, topLeft.x + this.width*this.tileWidth);

		var originOffset = {
			x : rect.left - topLeft.x,
			y : rect.top - topLeft.y
		};

		var tileOrigin = {
			x : goog.math.safeFloor(originOffset.x/this.tileWidth),
			y : goog.math.safeFloor(originOffset.y/this.tileHeight)
		};

		var numTilesWide = goog.math.safeCeil(rect.width/this.tileWidth + originOffset.x/this.tileWidth - tileOrigin.x);
		var numTilesHigh = goog.math.safeCeil(rect.height/this.tileHeight + originOffset.y/this.tileHeight - tileOrigin.y);

		return new goog.math.Rect(tileOrigin.x, tileOrigin.y, numTilesWide, numTilesHigh);
	}

};

CrunchJS.Components.OccupancyGrid.prototype.toObj = function() {
	var obj = goog.base(this, 'toObj', {});

	obj.width = this.width;
	obj.height = this.height;
	obj.tileWidth = this.tileWidth;
	obj.tileHeight = this.tileHeight;

	obj.map = goog.array.map(this.map, function(col) {
		return goog.array.map(col, function(tile) {

			return {
				occupancy : tile.occupancy,
				entities : tile.entities.getValues()
			};

		}, this);

	}, this);

	obj.entityToTilesMap = goog.structs.map(this.entityToTilesMap, function(rect) {
		return {
			x : rect.left,
			y : rect.top,
			w : rect.width,
			h : rect.height
		};
	});

	return obj;
};

/**
 * Gets the updates for the component
 * @return {Object} The update object
 */
CrunchJS.Components.OccupancyGrid.prototype.getUpdates = function() {
	var obj = {};

	if(this.updates.width)
		obj.width = this.getWidth();
	if(this.updates.height)
		obj.height = this.getHeight();
	if(this.updates.tileWidth)
		obj.tileWidth = this.getTileWidth();
	if(this.updates.tileHeight)
		obj.tileHeight = this.getTileHeight;

	goog.structs.forEach(this.updates.map, function(tile) {
		if(!obj.map){
			obj.map = [];
		}
		// We store the tile as an integer representing what the x and y
		var x = tile%this.width,
			y = goog.math.safeFloor(tile/this.width);
		  	
		obj.map.push({
			x : x,
			y : y,
			occupancy : this.getTile(x,y).occupancy,
			entities : this.getTile(x,y).entities.getValues()
		});

	}, this);

	goog.structs.forEach(this.updates.entityToTilesMap, function(id) {
		if(!obj.entityToTilesMap)
			obj.entityToTilesMap = {};
		var rect = this.entityToTilesMap.get(id);

		var o = {};

		if(goog.isDefAndNotNull(rect)){
			 o = {
				x : rect.left,
				y : rect.top,
				width : rect.width,
				height : rect.height
			};
		}

		obj.entityToTilesMap[id] = o;
	}, this);

	return obj;
};

/**
 * Updates the component from the object
 * @param  {Object} obj The update object created by getUpdates
 */
CrunchJS.Components.OccupancyGrid.prototype.update = function(obj) {
	if(obj.width)
		this.width = obj.width;
	if(obj.height)
		this.height = obj.height;
	if(obj.tileWidth)
		this.tileWidth = obj.tileWidth;
	if(obj.tileHeight)
		this.tileHeight = obj.tileHeight;

	goog.array.forEach(obj.map, function(o) {
		this.getTile(o.x, o.y).occupancy = o.occupancy;
		this.getTile(o.x, o.y).entities = new goog.structs.Set(o.entities);
	}, this);

	goog.object.forEach(obj.entityToTilesMap, function(rect, id) {
		if(!goog.isNumber(rect.width) || !goog.isNumber(rect.height) || !goog.isNumber(rect.y) || !goog.isNumber(rect.x)){
			this.entityToTilesMap.remove(id);
		}
		// If it is in there, update it
		else if(this.entityToTilesMap.containsKey(id)){
			var r = this.entityToTilesMap.get(id);

			r.left = rect.x;
			r.top = rect.y;
			r.width = rect.width;
			r.height = rect.height;
		}
		// Otherwise create a new rect
		else{
			this.entityToTilesMap.set(id, new goog.math.Rect(rect.x, rect.y, rect.width, rect.height));
		}

	}, this);
};

CrunchJS.Components.OccupancyGrid.prototype.resetUpdates = function() {
	this.updates.width = false;
	this.updates.height = false;
	this.updates.tileWidth = false;
	this.updates.tileHeight = false;

	this.updates.map.clear();
	this.updates.entityToTilesMap.clear();
};


